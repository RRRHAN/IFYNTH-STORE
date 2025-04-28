package cart

import "github.com/google/uuid"

type AddToCartRequest struct {
	ProductID uuid.UUID `json:"product_id" validate:"required"`
	Size      string    `json:"size" validate:"required"`
	Quantity  int       `json:"quantity" validate:"required,min=1"`
}

type UpdateCartQuantityRequest struct {
	ProductID  uuid.UUID `json:"product_id" validate:"required"`
	CartItemID uuid.UUID `json:"cart_item_id" validate:"required"`
	Size       string    `json:"size" validate:"required"`
	Quantity   int       `json:"quantity" validate:"required,min=1"`
}

type DeleteFromCartRequest struct {
	CartItemID uuid.UUID `json:"cart_item_id" validate:"required"`
}
