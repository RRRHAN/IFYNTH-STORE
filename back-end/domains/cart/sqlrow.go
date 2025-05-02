package cart

import (
	"time"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/google/uuid"
)

type Cart struct {
	ID            uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID        uuid.UUID  `gorm:"type:uuid;not null"`
	TotalPrice    float64    `gorm:"not null"`
	TotalQuantity int        `gorm:"not null"`
	TotalWeight   float64    `gorm:"not null"`
	CreatedAt     time.Time  `gorm:"autoCreateTime"`
	UpdatedAt     time.Time  `gorm:"autoUpdateTime"`
	Items         []CartItem `gorm:"foreignKey:CartID;references:ID"`
}

type CartItem struct {
	ID        uuid.UUID       `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CartID    uuid.UUID       `gorm:"type:uuid;not null"`
	ProductID uuid.UUID       `gorm:"type:uuid;not null"`
	Size      string          `gorm:"not null"`
	Quantity  int             `gorm:"not null"`
	Weight    float64         `gorm:"not null"`
	Price     float64         `gorm:"not null"`
	CreatedAt time.Time       `gorm:"autoCreateTime"`
	UpdatedAt time.Time       `gorm:"autoUpdateTime"`
	Product   product.Product `gorm:"foreignKey:ProductID"`
}
