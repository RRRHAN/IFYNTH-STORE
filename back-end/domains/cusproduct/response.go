package cusproduct

import "github.com/google/uuid"

type CustomerProductMessage struct {
	ProductID   uuid.UUID
	Name        string
	Price       float64
	Status      string
	URL         string
	UnreadCount int
}
