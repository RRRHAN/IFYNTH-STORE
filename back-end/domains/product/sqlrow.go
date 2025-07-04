package product

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name           string
	TotalStock     int                  `gorm:"type:integer"`
	Description    string               `gorm:"type:text"`
	Price          float64              `gorm:"type:decimal;not null"`
	Weight         float64              `gorm:"not null"`
	Department     string               `gorm:"type:varchar(3);check(department in ('IFY', 'NTH'))"`
	Category       string               `gorm:"type:varchar(50);not null"`
	LastHandleBy   uuid.UUID            `gorm:"type:uuid"`
	CreatedAt      time.Time            `gorm:"autoCreateTime"`
	UpdatedAt      time.Time            `gorm:"autoUpdateTime"`
	ProductImages  []ProductImage       `gorm:"foreignKey:ProductID"`
	StockDetails   []ProductStockDetail `gorm:"foreignKey:ProductID"`
	ProductCapital ProductCapital       `gorm:"foreignKey:ProductID"`
}

func (Product) TableName() string {
	return "product"
}

type ProductCapital struct {
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProductID      uuid.UUID `gorm:"type:uuid;not null"`
	TotalStock     int       `gorm:"type:integer;not null"`
	CapitalPerItem float64   `gorm:"type:decimal;not null"`
	TotalCapital   float64   `gorm:"type:decimal;not null"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime"`
}

func (ProductCapital) TableName() string {
	return "capital"
}

type ProductStockDetail struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProductID uuid.UUID `gorm:"type:uuid;not null"`
	Size      string    `gorm:"type:varchar(10);not null"`
	Stock     int       `gorm:"type:decimal;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

func (ProductStockDetail) TableName() string {
	return "product_stock_detail"
}

type ProductImage struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProductID uuid.UUID `gorm:"type:uuid;not null"`
	URL       string
	CreatedAt time.Time `gorm:"autoCreateTime"`
}

func (ProductImage) TableName() string {
	return "product_image"
}

type DepartmentCount struct {
	Department string
	Count      int64
}
