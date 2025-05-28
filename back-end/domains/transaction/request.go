package transaction

import (
	"mime/multipart"
	"time"
)

type AddTransactionRequest struct {
	Name             string                `json:"name" form:"name" binding:"required"`
	PhoneNumber      string                `json:"phone_number" form:"phone_number" binding:"required"`
	PaymentMethod    string                `json:"payment_method" form:"payment_method" binding:"required"`
	PaymentProof     *multipart.FileHeader `json:"payment_proof" form:"payment_proof" binding:"required"`
	Address          string                `json:"address" form:"address" binding:"required"`
	ZipCode          string                `json:"zip_code" form:"zip_code" binding:"required"`
	DestinationLabel string                `json:"destination_label" form:"destination_label" binding:"required"`
	Courir           string                `json:"courir" form:"name" courir:"required"`
	ShippingCost     float64               `json:"shipping_cost" form:"shipping_cost" binding:"required"`
}

type UpdateStatusRequest struct {
	TransactionID string `json:"transaction_id"`
	NewStatus     string `json:"status"`
}

type StatusCount struct {
	Status string
	Count  int64
}

type Result struct {
	Date        time.Time
	TotalAmount float64
}

type ResultByCustomer struct {
	UserID           string  `json:"userID"`
	CustomerName     string  `json:"CustomerName"`
	PhoneNumber      string  `json:"PhoneNumber"`
	TotalAmount      float64 `json:"TotalAmount"`
	TransactionCount int64   `json:"TotalTransaction"`
}
