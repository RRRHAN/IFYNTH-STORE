package product

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name          string
	Stock         float64 `gorm:"type:decimal"`
	Description   string  `gorm:"type:text"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	ProductImages []ProductImage `gorm:"foreignKey:ProductID"`
}

func (Product) TableName() string {
	return "product"
}

type ProductImage struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProductID uuid.UUID `gorm:"type:uuid;not null"`
	URL       string
	CreatedAt time.Time
}

func (ProductImage) TableName() string {
	return "product_image"
}
