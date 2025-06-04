package cusproduct

import (
	"github.com/google/uuid"
)

type CustomerProductMessage struct {
	ProductID   uuid.UUID
	Name        string
	Price       float64
	Status      string
	URL         string
	UnreadCount int
}

type ProductWithCustomer struct {
	CustomerProduct
	CustomerName string `json:"customer_name"`
	UnreadCount  int
}

type Result struct {
	ProductID uuid.UUID
	Total     int
}

type Unread struct {
	ProductID uuid.UUID
	Total     int
}

// Ambil nama user dari tabel users
type userNameMap struct {
	ID   uuid.UUID
	Name string
}
