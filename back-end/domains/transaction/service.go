package transaction

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cart"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
)

type Service interface {
	AddTransaction(ctx context.Context, req AddTransactionRequest, paymentProofFile *multipart.FileHeader) error
	GetTransactionsByUserID(ctx context.Context) ([]Transaction, error)
	GetAllTransaction(ctx context.Context) ([]Transaction, error)
	UpdateStatus(ctx context.Context, req UpdateStatusRequest) error
	GetTransactionCountByStatus(ctx context.Context) ([]StatusCount, error)
	GetTotalAmountByDate(ctx context.Context) ([]Result, error)
	GetTotalIncome(ctx context.Context) (float64, error)
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

func (s *service) GetAllTransaction(ctx context.Context) ([]Transaction, error) {
	var transactions []Transaction

	result := s.db.
		Preload("ShippingAddress").
		Preload("TransactionDetails.Product").
		Find(&transactions)

	if result.Error != nil {
		return nil, result.Error
	}

	return transactions, nil
}

func (s *service) GetTransactionsByUserID(ctx context.Context) ([]Transaction, error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, err
	}

	var transactions []Transaction

	result := s.db.
		Preload("ShippingAddress").
		Preload("TransactionDetails.Product", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "price")
		}).
		Where("user_id = ?", token.Claims.UserID).
		Find(&transactions)

	if result.Error != nil {
		return nil, result.Error
	}

	return transactions, nil
}

func (s *service) AddTransaction(ctx context.Context, req AddTransactionRequest, paymentProofFile *multipart.FileHeader) error {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	var user_cart cart.Cart
	err = s.db.WithContext(ctx).Where("user_id = ?", token.Claims.UserID).First(&user_cart).Error
	if err != nil {
		return fmt.Errorf("cart not found: %w", err)
	}

	var items []cart.CartItem
	err = s.db.WithContext(ctx).Where("cart_id = ?", user_cart.ID).Find(&items).Error
	if err != nil || len(items) == 0 {
		return fmt.Errorf("no items in cart: %w", err)
	}

	var paymentProofPath string
	if paymentProofFile != nil {
		ext := filepath.Ext(paymentProofFile.Filename)
		if !isValidImageExtension(ext) {
			return fmt.Errorf("invalid file type: %v", ext)
		}

		filename, err := generateMediaName(user_cart.UserID.String())
		if err != nil {
			return fmt.Errorf("error generating image name: %v", err)
		}
		filename = fmt.Sprintf("%s%s", filename, ext)
		path := filepath.Join("uploads", "payment", filename)

		if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}

		if err := s.saveImage(ctx, paymentProofFile, path); err != nil {
			return err
		}

		paymentProofPath = "/uploads/payment/" + filename
	}

	tx := s.db.WithContext(ctx).Begin()

	transaction := Transaction{
		ID:            uuid.New(),
		UserID:        user_cart.UserID,
		TotalAmount:   user_cart.TotalPrice + req.ShippingCost,
		PaymentMethod: req.PaymentMethod,
		PaymentProof:  paymentProofPath,
		Status:        "pending",
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to create transaction: %w", err)
	}

	for _, item := range items {
		detail := TransactionDetails{
			ID:            uuid.New(),
			TransactionID: transaction.ID,
			ProductID:     item.ProductID,
			Size:          item.Size,
			Quantity:      item.Quantity,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}
		if err := tx.Create(&detail).Error; err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to create transaction detail: %w", err)
		}

	}

	shipping := ShippingAddress{
		ID:               uuid.New(),
		TransactionID:    transaction.ID,
		Name:             req.Name,
		PhoneNumber:      req.PhoneNumber,
		Address:          req.Address,
		ZipCode:          req.ZipCode,
		DestinationLabel: req.DestinationLabel,
		Courir:           req.Courir,
		ShippingCost:     req.ShippingCost,
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	if err := tx.Create(&shipping).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to create shipping address: %w", err)
	}

	// Clear the cart
	if err := tx.Where("cart_id = ?", user_cart.ID).Delete(&cart.CartItem{}).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to clear cart items: %w", err)
	}
	if err := tx.Delete(&user_cart).Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to delete cart: %w", err)
	}

	return tx.Commit().Error
}

func (s *service) UpdateStatus(ctx context.Context, req UpdateStatusRequest) error {
	var transaction Transaction

	if err := s.db.WithContext(ctx).First(&transaction, "id = ?", req.TransactionID).Error; err != nil {
		return fmt.Errorf("transaction not found: %v", err)
	}

	if req.NewStatus == "paid" {
		var details []TransactionDetails
		if err := s.db.WithContext(ctx).
			Where("transaction_id = ?", transaction.ID).
			Find(&details).Error; err != nil {
			return fmt.Errorf("failed to fetch transaction details: %w", err)
		}

		for _, detail := range details {
			err := s.db.WithContext(ctx).Model(&product.ProductStockDetail{}).
				Where("product_id = ? AND size = ?", detail.ProductID, detail.Size).
				UpdateColumn("stock", gorm.Expr("stock - ?", detail.Quantity)).Error
			if err != nil {
				return fmt.Errorf("failed to update stock: %w", err)
			}
		}
	}

	transaction.Status = req.NewStatus
	if err := s.db.WithContext(ctx).Save(&transaction).Error; err != nil {
		return fmt.Errorf("failed to update transaction status: %v", err)
	}

	return nil
}

func (s *service) GetTransactionCountByStatus(ctx context.Context) ([]StatusCount, error) {
	var results []StatusCount

	if err := s.db.WithContext(ctx).
		Model(&Transaction{}).
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&results).Error; err != nil {
		return nil, err
	}

	return results, nil
}

func (s *service) GetTotalAmountByDate(ctx context.Context) ([]Result, error) {
	var results []Result

	err := s.db.WithContext(ctx).
		Model(&Transaction{}).
		Select("DATE(created_at) as date, SUM(total_amount) as total_amount").
		Where("status NOT IN ?", []string{"pending", "cancelled"}).
		Group("DATE(created_at)").
		Order("DATE(created_at)").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return results, nil
}

func (s *service) GetTotalIncome(ctx context.Context) (float64, error) {
	var totalIncome float64

	if err := s.db.WithContext(ctx).
		Model(&Transaction{}).
		Select("COALESCE(SUM(total_amount), 0)").
		Scan(&totalIncome).Error; err != nil {
		return 0, err
	}

	return totalIncome, nil
}
