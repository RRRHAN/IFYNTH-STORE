package product

import "github.com/google/uuid"

type ProductProfit struct {
	ProductID    uuid.UUID
	Name         string
	TotalCapital float64
	TotalRevenue float64
}
