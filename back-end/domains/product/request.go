package product

import "mime/multipart"

type AddProductRequest struct {
	Name         string
	Description  string
	Price        float64
	Department   string
	Category     string
	Images       []*multipart.FileHeader
	StockDetails []StockDetailInput
}

type StockDetailInput struct {
	Size  string
	Stock int
}

type RemovedImage struct {
	ProductID string `json:"productID"`
	URL       string `json:"url"`
}

type UpdateProductRequest struct {
	Name          string                  `json:"name"`
	Description   string                  `json:"description"`
	Price         float64                 `json:"price"`
	Department    string                  `json:"department"`
	Category      string                  `json:"category"`
	StockDetails  []StockDetailInput      `json:"stockDetails"`
	RemovedImages []RemovedImage          `json:"removedImages"`
	Images        []*multipart.FileHeader `json:"images"`
}

type DeleteProductRequest struct {
	ProductID string `json:"product_id"`
}
