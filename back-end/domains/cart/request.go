package cart

import "github.com/google/uuid"

// AddToCartRequest struktur permintaan untuk menambahkan item ke keranjang
type AddToCartRequest struct {
	ProductID uuid.UUID `json:"product_id" validate:"required,uuid4"`
	Size      string    `json:"size" validate:"required"`
	Quantity  int       `json:"quantity" validate:"required,min=1"`
}

type UpdateCartQuantityRequest struct {
	ProductID uuid.UUID `json:"product_id" validate:"required,uuid4"`
	Size      string    `json:"size" validate:"required"`
	Quantity  int       `json:"quantity" validate:"required,min=1"`
}

type DeleteFromCartRequest struct {
	ProductID uuid.UUID `json:"product_id" validate:"required,uuid4"`
	Size      string    `json:"size" validate:"required"`
}
