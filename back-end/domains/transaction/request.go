package transaction

import "mime/multipart"

type AddTransactionRequest struct {
	Name             string                `json:"name"`
	PhoneNumber      string                `json:"phone_number"`
	PaymentMethod    string                `json:"payment_method"`
	PaymentProof     *multipart.FileHeader `json:"payment_proof"`
	Address          string                `json:"address"`
	ZipCode          string                `json:"zip_code"`
	DestinationLabel string                `json:"destination_label"`
	Courir           string                `json:"courir"`
	ShippingCost     float64               `json:"shipping_cost"`
}

type UpdateStatusRequest struct {
	TransactionID string `json:"transaction_id"`
	NewStatus     string `json:"status"`
}
