package message

import "github.com/google/uuid"

type AddMessageRequest struct {
	ProductID uuid.UUID `json:"product_id"`
	Message   string    `json:"message"`
}

type StockDetailInput struct {
	Size  string
	Stock int
}

type Removedmedia struct {
	ProductID string `json:"productID"`
	URL       string `json:"url"`
}

type DeleteProductRequest struct {
	ProductID string `json:"product_id"`
}

type UpdateStatusRequest struct {
	ProductID string `json:"product_id"`
	NewStatus string `json:"status"`
}
