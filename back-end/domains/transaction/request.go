package transaction

import (
	"mime/multipart"

	"github.com/google/uuid"
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
	TransactionId uuid.UUID             `json:"transactionId" form:"transactionId" binding:"required"`
	PaymentProof  *multipart.FileHeader `json:"payment_proof" form:"payment_proof" binding:"required"`
}
