package product

import "mime/multipart"

type AddProductRequest struct {
	Name         string                  `form:"name"`
	Description  string                  `form:"description"`
	Price        float64                 `form:"price"`
	Weight       float64                 `form:"weight"`
	Department   string                  `form:"department"`
	Category     string                  `form:"category"`
	Images       []*multipart.FileHeader `form:"images"`
	StockDetails []StockDetailInput      `form:"stockDetails"`
	Capital      float64                 `form:"capital"`
}

type StockDetailInput struct {
	Size  string `json:"size"`
	Stock int    `json:"stock"`
}

type RemovedImage struct {
	ProductID string `json:"productID"`
	URL       string `json:"url"`
}

type UpdateProductRequest struct {
	Name          string                  `json:"name"`
	Description   string                  `json:"description"`
	Price         float64                 `json:"price"`
	Weight        float64                 `json:"weight"`
	Department    string                  `json:"department"`
	Category      string                  `json:"category"`
	StockDetails  []StockDetailInput      `json:"stockDetails"`
	RemovedImages []RemovedImage          `json:"removedImages"`
	Images        []*multipart.FileHeader `json:"images"`
	Capital       float64                 `json:"capital"`
}

type DeleteProductRequest struct {
	ProductID string `json:"product_id"`
}

type GetAllProductReq struct {
	Keyword    string
	Department string
	Category   string
	Page       int
	Limit      int
}
