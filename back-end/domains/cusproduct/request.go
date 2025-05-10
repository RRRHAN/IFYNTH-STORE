package cusproduct

import "mime/multipart"

type AddProductRequest struct {
	Name        string
	Description string
	Price       float64
	Files       []*multipart.FileHeader
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
