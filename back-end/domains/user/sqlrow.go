package user

import (
	"time"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/address"
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
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}

func (Admin) TableName() string {
	return "admin"
}

type Customer struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name        string
	PhoneNumber string
	Username    string `gorm:"unique"`
	Password    string
	Email       string
	Address     []address.CustomerAddress `gorm:"foreignKey:UserID"`
	CreatedAt   time.Time                 `gorm:"autoCreateTime"`
	UpdatedAt   time.Time                 `gorm:"autoUpdateTime"`
}

func (Customer) TableName() string {
	return "customer"
}

type AdminActivity struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	AdminID     uuid.UUID
	Description string
	CreatedAt   time.Time `gorm:"autoCreateTime"`
}

func (AdminActivity) TableName() string {
	return "admin_activity"
}
