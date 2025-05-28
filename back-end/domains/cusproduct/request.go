package cusproduct

import "mime/multipart"

type AddProductRequest struct {
	Name        string                  `form:"name" binding:"required"`
	Description string                  `form:"description" binding:"required"`
	Price       float64                 `form:"price" binding:"required"`
	Files       []*multipart.FileHeader `form:"files" binding:"required"`
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
