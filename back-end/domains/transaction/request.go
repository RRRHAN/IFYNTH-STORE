package transaction

import (
	"mime/multipart"
)

type AddTransactionRequest struct {
	CustomerAddressID string
	CourierIndex      int
}

type UpdateStatusRequest struct {
	TransactionID string `json:"transaction_id"`
	NewStatus     string `json:"status"`
}

type PayTransactionReq struct {
	TransactionId string                `json:"transactionId" form:"transactionId" binding:"required"`
	PaymentProof  *multipart.FileHeader `json:"payment_proof" form:"payment_proof" binding:"required"`
}
