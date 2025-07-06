package product

import "github.com/google/uuid"

type ProductProfit struct {
	ProductID    uuid.UUID
	Name         string
	TotalCapital float64
	TotalRevenue float64
}

type PaginatedProductsResponse struct {
	Data       []Product      `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
}

type PaginationMeta struct {
	Total       int `json:"total"`
	PerPage     int `json:"per_page"`
	CurrentPage int `json:"current_page"`
	TotalPages  int `json:"total_pages"`
}
