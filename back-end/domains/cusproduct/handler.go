package cusproduct

import (
	"fmt"
	"net/http"
	"strconv"

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

	form, err := ctx.MultipartForm()
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	name := form.Value["name"]
	description := form.Value["description"]
	price := form.Value["price"]
	files := form.File["files"]

	fmt.Println("Received name:", name)
	fmt.Println("Received description:", description)
	fmt.Println("Received price:", price)
	fmt.Println("Received files:", files)

	if len(name) == 0 || len(description) == 0 || len(price) == 0 || len(files) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "One or more required fields are missing"})
		return
	}

	for _, file := range files {
		if !isValidImage(file) && !isValidVideo(file) {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": fmt.Sprintf("Invalid file format: %s", file.Filename),
			})
			return
		}
	}

	priceValue, err := strconv.ParseFloat(price[0], 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}

	req := AddProductRequest{
		Name:        name[0],
		Description: description[0],
		Price:       priceValue,
		Files:       files,
	}

	if err := h.service.AddProduct(ctx.Request.Context(), req, files); err != nil {
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
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "One or more required fields are missing"})
		return
	}

	if err := h.service.UpdateStatus(ctx, req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{"message": "status updated successfully"})
}
