package message

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Handler interface {
	AddMessage(ctx *gin.Context)
	GetMessageByProductID(ctx *gin.Context)
}

type handler struct {
	service  Service
	validate *validator.Validate
}

func NewHandler(service Service, validate *validator.Validate) Handler {
	return &handler{
		service:  service,
		validate: validate,
	}
}

func (h *handler) GetMessageByProductID(ctx *gin.Context) {
	productIDParam := ctx.Param("product_id")
	productID, err := uuid.Parse(productIDParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid product ID format",
		})
		return
	}

	message, err := h.service.GetMessageByProductID(ctx.Request.Context(), productID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{
				"error": "Message not found",
			})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to get message",
			})
		}
		return
	}

	ctx.JSON(http.StatusOK, message)
}

func (h *handler) AddMessage(ctx *gin.Context) {
	var req AddMessageRequest

	// Bind JSON dari body request ke struct
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request payload",
			"details": err.Error(),
		})
		return
	}

	// Panggil service untuk menyimpan pesan
	if err := h.service.AddMessage(ctx, req); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to add message",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Message added successfully",
	})
}
