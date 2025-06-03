package transaction

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	rajaongkir "github.com/RRRHAN/IFYNTH-STORE/back-end/client/raja-ongkir"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/address"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cart"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/ongkir"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/user"
	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
	fileutils "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/file"
)

type Service interface {
	AddTransaction(ctx context.Context, req AddTransactionRequest) error
	GetTransactionsByUserID(ctx context.Context) ([]Transaction, error)
	GetAllTransaction(ctx context.Context) ([]Transaction, error)
	UpdateStatus(ctx context.Context, req UpdateStatusRequest) error
	GetTransactionCountByStatus(ctx context.Context) ([]StatusCount, error)
	GetTotalAmountByDate(ctx context.Context) ([]Result, error)
	GetTotalIncome(ctx context.Context) (float64, error)
	GetTotalTransactionByCustomer(ctx context.Context) ([]ResultByCustomer, error)
	PayTransaction(ctx context.Context, input PayTransactionReq) error
}

type service struct {
	authConfig    config.Auth
	db            *gorm.DB
	ongkirService ongkir.Service
}

func NewService(config *config.Config, db *gorm.DB, rajaOngkirClient rajaongkir.Client) Service {
	return &service{
		authConfig:    config.Auth,
		db:            db,
		ongkirService: ongkir.NewService(rajaOngkirClient, db),
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
		Preload("TransactionDetails.Product.ProductImages", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "product_id", "url").Order("id ASC")
		}).
		Where("user_id = ?", token.Claims.UserID).
		Find(&transactions)

	if result.Error != nil {
		return nil, result.Error
	}

	return transactions, nil
}

func (s *service) AddTransaction(ctx context.Context, req AddTransactionRequest) error {
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

	var customerAddress address.CustomerAddress
	if err := s.db.First(&customerAddress, "id = ?", req.CustomerAddressID).Error; err != nil {
		return fmt.Errorf("failed to fetch customer address data: %w", err)
	}

	costs, err := s.ongkirService.GetShippingCost(context.Background(), ongkir.GetShippingCostReq{
		AddressId: customerAddress.ID,
		Weight:    strconv.Itoa(int(math.Ceil(user_cart.TotalWeight / 1000))),
		ItemValue: strconv.Itoa(int(math.Ceil(user_cart.TotalPrice))),
	})

	if err != nil {
		return err
	}

	if req.CourierIndex < 0 || req.CourierIndex >= len(costs) {
		return fmt.Errorf("invalid courier index: %d, available options: %d", req.CourierIndex, len(costs))
	}

	selected := costs[req.CourierIndex]

	tx := s.db.WithContext(ctx).Begin()

	transaction := Transaction{
		ID:            uuid.New(),
		UserID:        user_cart.UserID,
		TotalAmount:   user_cart.TotalPrice + float64(selected.ShippingCost),
		PaymentMethod: "bank transfer",
		PaymentProof:  "",
		Status:        "draft",
		LastHandleBy:  nil,
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
		Name:             customerAddress.RecipientsName,
		PhoneNumber:      customerAddress.RecipientsNumber,
		Address:          customerAddress.Address,
		ZipCode:          customerAddress.ZipCode,
		DestinationLabel: customerAddress.DestinationLabel,
		Courir:           selected.ShippingName + "-" + selected.ServiceName,
		ShippingCost:     float64(selected.ShippingCost),
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
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}
	userID := token.Claims.UserID

	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var transaction Transaction

		if err := tx.First(&transaction, "id = ?", req.TransactionID).Error; err != nil {
			return fmt.Errorf("transaction not found: %v", err)
		}

		// Jika status baru "paid", update stock
		if req.NewStatus == "paid" {
			var details []TransactionDetails
			if err := tx.Where("transaction_id = ?", transaction.ID).Find(&details).Error; err != nil {
				return fmt.Errorf("failed to fetch transaction details: %w", err)
			}

			for _, detail := range details {
				if err := tx.Model(&product.ProductStockDetail{}).
					Where("product_id = ? AND size = ?", detail.ProductID, detail.Size).
					UpdateColumn("stock", gorm.Expr("stock - ?", detail.Quantity)).Error; err != nil {
					return fmt.Errorf("failed to update stock: %w", err)
				}
			}
		}

		// Buat activity log
		activity := user.AdminActivity{
			ID:      uuid.New(),
			AdminID: userID,
			Description: fmt.Sprintf(
				"update status of transaction_id %s from %s to %s",
				transaction.ID.String(),
				transaction.Status,
				req.NewStatus,
			),
			CreatedAt: time.Now(),
		}

		if err := tx.Create(&activity).Error; err != nil {
			return fmt.Errorf("failed to create admin activity: %w", err)
		}

		// Update transaksi
		transaction.LastHandleBy = &userID
		transaction.Status = req.NewStatus
		if err := tx.Save(&transaction).Error; err != nil {
			return fmt.Errorf("failed to update transaction status: %v", err)
		}

		return nil
	})
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

func (s *service) GetTotalTransactionByCustomer(ctx context.Context) ([]ResultByCustomer, error) {
	var results []ResultByCustomer

	err := s.db.WithContext(ctx).
		Model(&Transaction{}).
		Joins("JOIN customer ON transactions.user_id = customer.id").
		Select("transactions.user_id, customer.name as customer_name, customer.phone_number as phone_number, SUM(transactions.total_amount) as total_amount, COUNT(transactions.id) as transaction_count").
		Where("transactions.status NOT IN (?)", []string{"pending", "cancelled"}).
		Group("transactions.user_id, customer.name, customer.phone_number").
		Order("total_amount DESC").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	return results, nil
}

func (s *service) PayTransaction(ctx context.Context, input PayTransactionReq) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	if input.PaymentProof == nil {
		return apierror.NewWarn(http.StatusBadRequest, "file tidak bolah kosong")
	}

	ext := filepath.Ext(input.PaymentProof.Filename)
	if !fileutils.IsValidImageExtension(ext) {
		return fmt.Errorf("invalid file type: %v", ext)
	}

	filename, err := fileutils.GenerateMediaName(token.Claims.UserID.String())
	if err != nil {
		return fmt.Errorf("error generating image name: %v", err)
	}
	filename = fmt.Sprintf("%s%s", filename, ext)
	path := filepath.Join("uploads", "payment", filename)

	if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	if err := fileutils.SaveMedia(ctx, input.PaymentProof, path); err != nil {
		return err
	}

	var transaction *Transaction
	err = s.db.First(transaction, input.TransactionId).Error
	if err != nil {
		return err
	}

	paymentProofPath := "/uploads/payment/" + filename
	transaction.PaymentProof = paymentProofPath
	transaction.Status = "pending"

	err = s.db.Save(transaction).Error
	if err != nil {
		return err
	}

	return nil
}
