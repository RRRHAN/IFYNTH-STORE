package transaction

import (
	"time"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/google/uuid"
)

type Transaction struct {
	ID                 uuid.UUID            `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID             uuid.UUID            `gorm:"type:uuid;not null"`
	TotalAmount        float64              `gorm:"not null"`
	PaymentMethod      string               `gorm:"not null"`
	PaymentProof       string               `gorm:"not null"`
	Status             string               `gorm:"not null"`
	LastHandleBy       *uuid.UUID           `gorm:"type:uuid"`
	CreatedAt          time.Time            `gorm:"autoCreateTime"`
	UpdatedAt          time.Time            `gorm:"autoUpdateTime"`
	TransactionDetails []TransactionDetails `json:"TransactionDetails" gorm:"foreignKey:TransactionID"`
	ShippingAddress    ShippingAddress      `gorm:"foreignKey:TransactionID"`
}

func (Transaction) TableName() string {
	return "transactions"
}

type TransactionDetails struct {
	ID            uuid.UUID       `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	TransactionID uuid.UUID       `gorm:"type:uuid;not null"`
	ProductID     uuid.UUID       `gorm:"type:uuid;not null"`
	Size          string          `gorm:"not null"`
	Quantity      int             `gorm:"not null"`
	CreatedAt     time.Time       `gorm:"autoCreateTime"`
	UpdatedAt     time.Time       `gorm:"autoUpdateTime"`
	Product       product.Product `gorm:"foreignKey:ProductID"`
}

func (TransactionDetails) TableName() string {
	return "transaction_details"
}

type ShippingAddress struct {
	ID               uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	TransactionID    uuid.UUID `gorm:"type:uuid;not null"`
	Name             string    `gorm:"not null"`
	PhoneNumber      string    `gorm:"not null"`
	Address          string    `gorm:"not null"`
	ZipCode          string    `gorm:"not null"`
	DestinationLabel string    `gorm:"not null"`
	Courir           string    `gorm:"not null"`
	ShippingCost     float64   `gorm:"not null"`
	CreatedAt        time.Time `gorm:"autoCreateTime"`
	UpdatedAt        time.Time `gorm:"autoUpdateTime"`
}

func (ShippingAddress) TableName() string {
	return "shipping_address"
}
