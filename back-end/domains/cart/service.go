package cart

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
)

type Service interface {
	AddToCart(ctx context.Context, req AddToCartRequest) error
	UpdateCartQuantity(ctx context.Context, req UpdateCartQuantityRequest) error
	DeleteFromCart(ctx context.Context, req DeleteFromCartRequest) error
	GetCartByUserID(ctx context.Context) (*Cart, error)
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

func (s *service) AddToCart(ctx context.Context, req AddToCartRequest) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	if req.Quantity <= 0 {
		return fmt.Errorf("invalid quantity")
	}

	// Cari atau buat cart
	var cart Cart
	err = s.db.WithContext(ctx).
		Where("user_id = ?", token.Claims.UserID).
		First(&cart).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			cart = Cart{
				ID:         uuid.New(),
				UserID:     token.Claims.UserID,
				TotalPrice: 0,
				CreatedAt:  time.Now(),
				UpdatedAt:  time.Now(),
			}
			if err := s.db.WithContext(ctx).Create(&cart).Error; err != nil {
				return err
			}
		} else {
			return err
		}
	}

	// Ambil harga produk
	var product product.Product
	if err := s.db.WithContext(ctx).Where("id = ?", req.ProductID).First(&product).Error; err != nil {
		return fmt.Errorf("product not found: %w", err)
	}

	// Cek apakah item sudah ada di cart
	var existingItem CartItem
	err = s.db.WithContext(ctx).
		Where("cart_id = ? AND product_id = ? AND size = ?", cart.ID, req.ProductID, req.Size).
		First(&existingItem).Error

	if err == nil {
		// Update kuantitas tanpa mengubah harga
		existingItem.Quantity += req.Quantity
		existingItem.UpdatedAt = time.Now()

		// Jangan ubah harga, biarkan harga tetap seperti harga produk saat pertama kali ditambahkan
		if err := s.db.WithContext(ctx).Save(&existingItem).Error; err != nil {
			return err
		}
	} else if err == gorm.ErrRecordNotFound {
		// Tambah item baru dengan harga produk yang sudah diset
		item := CartItem{
			ID:        uuid.New(),
			CartID:    cart.ID,
			ProductID: req.ProductID,
			Size:      req.Size, // penting!
			Quantity:  req.Quantity,
			Price:     product.Price,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		}
		if err := s.db.WithContext(ctx).Create(&item).Error; err != nil {
			return err
		}
	} else {
		return err
	}

	// Update total cart
	var total float64
	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(price * quantity)").Scan(&total)

	cart.TotalPrice = total
	cart.UpdatedAt = time.Now()
	if err := s.db.WithContext(ctx).Save(&cart).Error; err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateCartQuantity(ctx context.Context, req UpdateCartQuantityRequest) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	var cart Cart
	err = s.db.WithContext(ctx).Where("user_id = ?", token.Claims.UserID).First(&cart).Error
	if err != nil {
		return err
	}

	var item CartItem
	err = s.db.WithContext(ctx).
		Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).
		First(&item).Error

	if err != nil {
		return err
	}

	item.Quantity = req.Quantity
	item.UpdatedAt = time.Now()

	if err := s.db.WithContext(ctx).Save(&item).Error; err != nil {
		return err
	}

	return nil
}

func (s *service) DeleteFromCart(ctx context.Context, req DeleteFromCartRequest) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	// Cari cart milik user
	var cart Cart
	if err := s.db.WithContext(ctx).
		Where("user_id = ?", token.Claims.UserID).
		First(&cart).Error; err != nil {
		return fmt.Errorf("cart not found: %w", err)
	}

	// Hapus cart item
	if err := s.db.WithContext(ctx).
		Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).
		Delete(&CartItem{}).Error; err != nil {
		return fmt.Errorf("failed to delete item: %w", err)
	}

	// Hitung ulang total cart setelah item dihapus
	var total float64
	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(price)").Scan(&total)

	cart.TotalPrice = total
	cart.UpdatedAt = time.Now()

	if err := s.db.WithContext(ctx).Save(&cart).Error; err != nil {
		return fmt.Errorf("failed to update cart total: %w", err)
	}

	return nil
}

func (s *service) GetCartByUserID(ctx context.Context) (*Cart, error) {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, err
	}

	// Ambil cart berdasarkan userID
	var cart Cart
	err = s.db.WithContext(ctx).
		Where("user_id = ?", token.Claims.UserID).
		First(&cart).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("cart not found for user: %w", err)
		}
		return nil, err
	}

	// Ambil semua cart item terkait dengan cart
	var cartItems []CartItem
	err = s.db.WithContext(ctx).
		Where("cart_id = ?", cart.ID).
		Find(&cartItems).Error

	if err != nil {
		return nil, err
	}

	// Kembalikan cart dan cartItems
	return &cart, nil
}
