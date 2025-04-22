package cart

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

// AddToCartRequest struktur permintaan untuk menambahkan item ke keranjang
type AddToCartRequest struct {
	UserID    string `json:"user_id" validate:"required,uuid4"`
	ProductID string `json:"product_id" validate:"required,uuid4"`
	Quantity  int    `json:"quantity" validate:"required,min=1"`
}

type UpdateCartQuantityRequest struct {
	UserID    string `json:"user_id" validate:"required,uuid4"`
	ProductID string `json:"product_id" validate:"required,uuid4"`
	Quantity  int    `json:"quantity" validate:"required,min=1"`
}

type DeleteFromCartRequest struct {
	UserID    string `json:"user_id" validate:"required,uuid4"`
	ProductID string `json:"product_id" validate:"required,uuid4"`
}

type Handler interface {
	AddToCart(ctx *gin.Context)
	UpdateCartQuantity(ctx *gin.Context)
	DeleteFromCart(ctx *gin.Context)
	GetCartByUserID(ctx *gin.Context)
}

type handler struct {
	service  Service
	validate *validator.Validate
}

func NewCartHandler(service Service, validate *validator.Validate) Handler {
	return &handler{
		service:  service,
		validate: validate,
	}
}

func (h *handler) AddToCart(ctx *gin.Context) {
	var req AddToCartRequest

	// Bind dan validasi input
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.validate.Struct(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Panggil service AddToCart (belum diimplementasi di sini)
	if err := h.service.AddToCart(ctx, req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, gin.H{
		"message": "Item added to cart successfully",
	})
}

func (h *handler) UpdateCartQuantity(ctx *gin.Context) {
	var req UpdateCartQuantityRequest

	// Validasi input dari JSON body
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Validasi struct menggunakan validator
	if err := h.validate.Struct(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Panggil service untuk update kuantitas
	if err := h.service.UpdateCartQuantity(ctx, req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{
		"message": "Cart quantity updated successfully",
	})
}

func (h *handler) DeleteFromCart(ctx *gin.Context) {
	var req DeleteFromCartRequest

	// Binding JSON body ke struct
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Panggil service untuk menghapus item dari cart
	if err := h.service.DeleteFromCart(ctx, req.UserID, req.ProductID); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Response sukses
	respond.Success(ctx, http.StatusOK, gin.H{
		"message": "Item removed from cart successfully",
	})
}

func (h *handler) GetCartByUserID(ctx *gin.Context) {
	userID := ctx.Param("user_id")

	if userID == "" {
		respond.Error(ctx, apierror.FromErr(fmt.Errorf("user_id is required")))
		return
	}

	// Panggil service untuk mendapatkan data cart dan cart items
	cart, cartItems, err := h.service.GetCartByUserID(ctx, userID)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Kembalikan response dengan data cart dan cartItems
	respond.Success(ctx, http.StatusOK, gin.H{
		"cart":       cart,
		"cart_items": cartItems,
	})
}
