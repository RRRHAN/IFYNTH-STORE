package user

import (
	"time"

	"github.com/google/uuid"
)

type InvalidToken struct {
	Token   string
	Expires time.Time
}

func (InvalidToken) TableName() string {
	return "invalid_token"
}

type Admin struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name        string
	Username    string `gorm:"unique"`
	Password    string
	PhoneNumber string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func (Admin) TableName() string {
	return "admin"
}

type Customer struct {
	ID              uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name            string
	Email           *string `gorm:"default:null"`
	PhoneNumber     string
	Username        string `gorm:"unique"`
	Password        string
	CreatedAt       time.Time
	UpdatedAt       time.Time
	CustomerDetails *CustomerDetails `gorm:"foreignKey:UserID;references:ID"`
}

func (Customer) TableName() string {
	return "customer"
}

type CustomerDetails struct {
	ID               uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID           uuid.UUID
	DestinationID    *string `gorm:"default:null"`
	Address          *string `gorm:"default:null"`
	ZipCode          *string `gorm:"default:null"`
	DestinationLabel *string `gorm:"default:null"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

func (CustomerDetails) TableName() string {
	return "customer_details"
}
