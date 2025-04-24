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
