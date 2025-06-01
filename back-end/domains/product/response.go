package product

import "github.com/google/uuid"

type ProductProfit struct {
	ProductID    uuid.UUID `json:"product_id"`
	Name         string    `json:"name"`
	TotalCapital float64   `json:"total_capital"`
	TotalRevenue float64   `json:"total_revenue"`
}
