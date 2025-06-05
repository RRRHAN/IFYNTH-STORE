package product

import "mime/multipart"

type AddProductRequest struct {
	Name         string                  `form:"name" binding:"required"`
	Description  string                  `form:"description" binding:"required"`
	Price        float64                 `form:"price" binding:"required"`
	Weight       float64                 `form:"weight" binding:"required"`
	Department   string                  `form:"department" binding:"required"`
	Category     string                  `form:"category" binding:"required"`
	Images       []*multipart.FileHeader `form:"images" binding:"required"`
	StockDetails []StockDetailInput      `form:"stock_details" binding:"required"`
	Capital      float64                 `form:"capital" binding:"required"`
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
}
