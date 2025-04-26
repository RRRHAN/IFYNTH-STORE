package cart

// AddToCartRequest struktur permintaan untuk menambahkan item ke keranjang
type AddToCartRequest struct {
	UserID    string `json:"user_id" validate:"required,uuid4"`
	ProductID string `json:"product_id" validate:"required,uuid4"`
	Size      string `json:"size" validate:"required"`
	Quantity  int    `json:"quantity" validate:"required,min=1"`
}

type UpdateCartQuantityRequest struct {
	UserID    string `json:"user_id" validate:"required,uuid4"`
	ProductID string `json:"product_id" validate:"required,uuid4"`
	Size      string `json:"size" validate:"required"`
	Quantity  int    `json:"quantity" validate:"required,min=1"`
}

type DeleteFromCartRequest struct {
	UserID    string `json:"user_id" validate:"required,uuid4"`
	ProductID string `json:"product_id" validate:"required,uuid4"`
	Size      string `json:"size" validate:"required"`
}
