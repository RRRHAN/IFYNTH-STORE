package transaction

import (
	"mime/multipart"

	"github.com/google/uuid"
)

type AddTransactionRequest struct {
	Name             string  `json:"name" form:"name" binding:"required"`
	PhoneNumber      string  `json:"phone_number" form:"phone_number" binding:"required"`
	PaymentMethod    string  `json:"payment_method" form:"payment_method" binding:"required"`
	Address          string  `json:"address" form:"address" binding:"required"`
	ZipCode          string  `json:"zip_code" form:"zip_code" binding:"required"`
	DestinationLabel string  `json:"destination_label" form:"destination_label" binding:"required"`
	Courir           string  `json:"courir" form:"courir" courir:"required"`
	ShippingCost     float64 `json:"shipping_cost" form:"shipping_cost" binding:"required"`
}

type UpdateStatusRequest struct {
	TransactionID string `json:"transaction_id"`
	NewStatus     string `json:"status"`
}

type PayTransactionReq struct {
	TransactionId uuid.UUID             `json:"transactionId" form:"transactionId" binding:"required"`
	PaymentProof  *multipart.FileHeader `json:"payment_proof" form:"payment_proof" binding:"required"`
}
