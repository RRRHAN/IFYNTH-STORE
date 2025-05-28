package cusproduct

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

type Handler interface {
	GetAllProducts(ctx *gin.Context)
	AddProduct(ctx *gin.Context)
	DeleteProduct(ctx *gin.Context)
	GetProductByID(ctx *gin.Context)
	GetProductByUserID(ctx *gin.Context)
	UpdateProductStatus(ctx *gin.Context)
	GetProductByMessage(ctx *gin.Context)
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

func (h *handler) GetAllProducts(ctx *gin.Context) {
	keyword, _ := ctx.GetQuery("keyword")

	res, err := h.service.GetAllProducts(ctx, keyword)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) GetProductByID(ctx *gin.Context) {
	id := ctx.Param("id")

	productID, err := uuid.Parse(id)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	product, err := h.service.GetProductByID(ctx, productID)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, product)
}

func (h *handler) GetProductByMessage(ctx *gin.Context) {
	keyword := ctx.Query("keyword")

	products, err := h.service.GetProductByMessage(ctx, keyword)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, products)
}

func (h *handler) GetProductByUserID(ctx *gin.Context) {
	keyword, _ := ctx.GetQuery("keyword")

	cart, err := h.service.GetProductByUserID(ctx, keyword)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, cart)
}

func (h *handler) AddProduct(ctx *gin.Context) {

	var input AddProductRequest
	err := ctx.ShouldBind(&input)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.service.AddProduct(ctx, input); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, gin.H{"message": "Product and files added successfully"})
}

func (h *handler) DeleteProduct(ctx *gin.Context) {
	var req DeleteProductRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.service.DeleteProduct(ctx.Request.Context(), req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func (h *handler) UpdateProductStatus(ctx *gin.Context) {
	var req UpdateStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if req.ProductID == "" || req.NewStatus == "" {
		respond.Error(ctx, apierror.NewWarn(http.StatusBadRequest, "One or more required fields are missing"))
		return
	}

	if err := h.service.UpdateStatus(ctx, req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{"message": "status updated successfully"})
}
