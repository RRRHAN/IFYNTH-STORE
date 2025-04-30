package cusproduct

import (
	"time"

	"github.com/google/uuid"
)

type CustomerProduct struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID      uuid.UUID `gorm:"type:uuid;not null"`
	Name        string
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"type:decimal;not null"`
	Status      string  `gorm:"type:varchar(255);default:'pending'"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	Files       []CustomerProductFile `gorm:"foreignKey:ProductID"`
}

func (CustomerProduct) TableName() string {
	return "cusproduct"
}

type CustomerProductFile struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	ProductID uuid.UUID `gorm:"type:uuid;not null"`
	URL       string
	CreatedAt time.Time
}

func (CustomerProductFile) TableName() string {
	return "customer_product_files"
}

type ProductWithCustomer struct {
	CustomerProduct
	CustomerName string `json:"customer_name"`
}
