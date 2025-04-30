package message

import (
	"context"
	"time"

	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
	"github.com/google/uuid"
)

type Service interface {
	GetMessageByProductID(ctx context.Context, productID uuid.UUID) ([]Message, error)
	AddMessage(ctx context.Context, req AddMessageRequest) error
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
	var messages []Message

	if err := s.db.WithContext(ctx).
		Where("product_id = ?", productID).
		Order("created_at DESC").
		Find(&messages).Error; err != nil {
		return nil, err
	}

	return messages, nil
}

func (s *service) AddMessage(ctx context.Context, req AddMessageRequest) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}
	// Product entry
	message := Message{
		ID:        uuid.New(),
		ProductID: req.ProductID,
		UserID:    token.Claims.UserID,
		Message:   req.Message,
		Role:      req.Role,
		CreatedAt: time.Now(),
	}

	// save to db
	if err := s.db.Create(&message).Error; err != nil {
		return err
	}

	return nil
}
