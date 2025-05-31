package message

import (
	"context"
	"time"

	"gorm.io/gorm"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/constants"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
	"github.com/google/uuid"
)

type Service interface {
	GetMessageByProductID(ctx context.Context, productID uuid.UUID) ([]Message, error)
	AddMessage(ctx context.Context, req AddMessageRequest) error
	CountUnread(ctx context.Context) (int, error)
}

type service struct {
	authConfig config.Auth
	db         *gorm.DB
}

func NewService(config *config.Config, db *gorm.DB) Service {
	return &service{
		authConfig: config.Auth,
		db:         db,
	}
}

func (s *service) GetMessageByProductID(ctx context.Context, productID uuid.UUID) ([]Message, error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, err
	}

	var messages []Message
	if err := s.db.WithContext(ctx).
		Where("product_id = ?", productID).
		Order("created_at DESC").
		Find(&messages).Error; err != nil {
		return nil, err
	}

	var role = token.Claims.Role

	switch role {
	case "ADMIN":
		if err := s.db.WithContext(ctx).
			Model(&Message{}).
			Where("product_id = ?", productID).
			Where("role = ?", "CUSTOMER").
			Update("is_read", true).Error; err != nil {
			return nil, err
		}
	case "CUSTOMER":
		if err := s.db.WithContext(ctx).
			Model(&Message{}).
			Where("product_id = ?", productID).
			Where("role = ?", "ADMIN").
			Update("is_read", true).Error; err != nil {
			return nil, err
		}
	}

	return messages, nil
}

func (s *service) CountUnread(ctx context.Context) (int, error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return 0, apierror.FromErr(err)
	}

	var userID = token.Claims.UserID
	var products []CustomerProduct
	if err := s.db.WithContext(ctx).
		Where("user_id", userID).
		Find(&products).Error; err != nil {
		return 0, apierror.FromErr(err)
	}

	var productID []uuid.UUID

	for _, product := range products {
		productID = append(productID, product.ID)
	}

	var messages []Message
	if err := s.db.WithContext(ctx).
		Where("product_id IN ?", productID).
		Where("role = ?", "ADMIN").
		Order("created_at DESC").
		Find(&messages).Error; err != nil {
		return 0, apierror.FromErr(err)
	}

	unreadCount := 0
	for _, msg := range messages {
		if !msg.IsRead {
			unreadCount++
		}

	}

	return unreadCount, nil
}

func (s *service) AddMessage(ctx context.Context, req AddMessageRequest) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	var (
		adminID    *uuid.UUID
		customerID *uuid.UUID
	)

	switch token.Claims.Role {
	case constants.ADMIN:
		adminID = &token.Claims.UserID
	case constants.CUSTOMER:
		customerID = &token.Claims.UserID
	}

	// Product entry
	message := Message{
		ID:         uuid.New(),
		ProductID:  req.ProductID,
		CustomerID: customerID,
		AdminID:    adminID,
		Message:    req.Message,
		Role:       token.Claims.Role,
		CreatedAt:  time.Now(),
	}

	// save to db
	if err := s.db.Create(&message).Error; err != nil {
		return err
	}

	return nil
}
