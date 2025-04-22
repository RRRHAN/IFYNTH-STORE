package product

import (
	"context"
	"time"

	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
)

type Service interface {
	GetAllProducts(ctx context.Context, keyword string) ([]Product, error)
	AddProduct(ctx context.Context, req AddProductRequest) error
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

func (s *service) GetAllProducts(ctx context.Context, keyword string) ([]Product, error) {
	var products []Product

	query := s.db.WithContext(ctx).Model(&Product{}).Preload("ProductImages")

	if keyword != "" {
		// Search name OR description
		query = query.Where(
			"name ILIKE ? OR description ILIKE ?",
			"%"+keyword+"%",
			"%"+keyword+"%",
		)
	}

	if err := query.Order("created_at DESC").Find(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
}

func (s *service) AddProduct(ctx context.Context, req AddProductRequest) error {
	product := Product{
		Name:        req.Name,
		Stock:       req.Stock,
		Description: req.Description,
		Price:       req.Price,
		Department:  req.Department, // Menambahkan Department
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Simpan produk terlebih dahulu
	if err := s.db.WithContext(ctx).Create(&product).Error; err != nil {
		return err
	}

	// Simpan gambar-gambar jika ada
	var productImages []ProductImage
	for _, url := range req.Images {
		productImages = append(productImages, ProductImage{
			ProductID: product.ID,
			URL:       url,
			CreatedAt: time.Now(),
		})
	}

	if len(productImages) > 0 {
		if err := s.db.WithContext(ctx).Create(&productImages).Error; err != nil {
			return err
		}
	}

	return nil
}
