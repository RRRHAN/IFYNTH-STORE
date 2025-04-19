package product

import (
	"context"

	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
)

type Service interface {
	GetAllProducts(ctx context.Context, keyword string) ([]Product, error)
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
