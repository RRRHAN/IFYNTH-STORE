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

	var stockDetail product.ProductStockDetail
	err = s.db.WithContext(ctx).
		Where("product_id = ? AND size = ?", req.ProductID, req.Size).
		First(&stockDetail).Error

	if err != nil {
		return fmt.Errorf("stock detail not found for size %s: %w", req.Size, err)
	}

	if req.Quantity > stockDetail.Stock {
		return fmt.Errorf("requested quantity exceeds available stock for size %s", req.Size)
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
			Size:      req.Size,
			Quantity:  req.Quantity,
			Weight:    product.Weight,
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
	var total_quantity int
	var total_weight float64

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(price * quantity)").Scan(&total)

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(quantity)").Scan(&total_quantity)

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(quantity * weight)").Scan(&total_weight)

	cart.TotalQuantity = total_quantity
	cart.TotalPrice = total
	cart.TotalWeight = total_weight
	cart.UpdatedAt = time.Now()
	if err := s.db.WithContext(ctx).Save(&cart).Error; err != nil {
		return err
	}

	return nil
}

func (s *service) UpdateCartQuantity(ctx context.Context, req UpdateCartQuantityRequest) error {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return fmt.Errorf("failed to get token claims: %w", err)
	}

	var stockDetail product.ProductStockDetail
	err = s.db.WithContext(ctx).
		Where("product_id = ? AND size = ?", req.ProductID, req.Size).
		First(&stockDetail).Error

	if err != nil {
		return fmt.Errorf("stock detail not found for size %s: %w", req.Size, err)
	}

	if req.Quantity > stockDetail.Stock {
		return fmt.Errorf("requested quantity exceeds available stock for size %s", req.Size)
	}

	var cart Cart
	err = s.db.WithContext(ctx).Where("user_id = ?", token.Claims.UserID).First(&cart).Error
	if err != nil {
		return fmt.Errorf("cart not found: %w", err)
	}

	var item CartItem
	err = s.db.WithContext(ctx).
		Where("cart_id = ? AND id = ?", cart.ID, req.CartItemID).
		First(&item).Error

	if err != nil {
		return fmt.Errorf("cart item not found: %w", err)
	}

	item.Quantity = req.Quantity
	item.UpdatedAt = time.Now()

	if err := s.db.WithContext(ctx).Save(&item).Error; err != nil {
		return fmt.Errorf("failed to update cart item: %w", err)
	}

	var total float64
	var total_quantity int
	var total_weight float64

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(price * quantity)").Scan(&total)

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(quantity)").Scan(&total_quantity)

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(weight * quantity)").Scan(&total_weight)

	cart.TotalPrice = total
	cart.TotalQuantity = total_quantity
	cart.TotalWeight = total_weight
	cart.UpdatedAt = time.Now()

	if err := s.db.WithContext(ctx).Save(&cart).Error; err != nil {
		return fmt.Errorf("failed to update cart totals: %w", err)
	}

	return nil
}

func (s *service) DeleteFromCart(ctx context.Context, req DeleteFromCartRequest) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	var cart Cart
	if err := s.db.WithContext(ctx).
		Where("user_id = ?", token.Claims.UserID).
		First(&cart).Error; err != nil {
		return fmt.Errorf("cart not found: %w", err)
	}

	if err := s.db.WithContext(ctx).
		Where("cart_id = ? AND id = ?", cart.ID, req.CartItemID).
		Delete(&CartItem{}).Error; err != nil {
		return fmt.Errorf("failed to delete item: %w", err)
	}

	var total float64
	var total_quantity int
	var total_weight float64

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(price * quantity)").Scan(&total)

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(quantity)").Scan(&total_quantity)

	s.db.WithContext(ctx).
		Model(&CartItem{}).
		Where("cart_id = ?", cart.ID).
		Select("SUM(weight * quantity)").Scan(&total_weight)

	cart.TotalPrice = total
	cart.TotalQuantity = total_quantity
	cart.TotalWeight = total_weight
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

	var cartItems []CartItem
	err = s.db.WithContext(ctx).
		Preload("Product", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name")
		}).
		Preload("Product.ProductImages", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "product_id", "url")
		}).
		Where("cart_id = ?", cart.ID).
		Find(&cartItems).Error
	if err != nil {
		return nil, err
	}

	cart.Items = cartItems

	return &cart, nil
}
