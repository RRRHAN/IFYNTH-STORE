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
	Price         float64 `gorm:"type:decimal;not null"`
	Department    string  `gorm:"type:varchar(3);check(department in ('IFY', 'NTH'))"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	ProductImages []ProductImage `gorm:"foreignKey:ProductID"`
}

type AddProductRequest struct {
	Name        string   `json:"name" binding:"required"`
	Stock       float64  `json:"stock" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Price       float64  `json:"price" binding:"required"`
	Department  string   `json:"department" binding:"required,oneof=IFY NTH"`
	Images      []string `json:"images"`
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
