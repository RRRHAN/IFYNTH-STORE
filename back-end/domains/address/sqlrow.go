package address

import (
	"time"

	"github.com/google/uuid"
)

type CustomerAddress struct {
	ID               uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CustomerID       uuid.UUID
	RecipientsName   string
	RecipientsNumber string
	DestinationID    string
	Address          string
	ZipCode          string
	DestinationLabel string
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

func (CustomerAddress) TableName() string {
	return "customer_address"
}
