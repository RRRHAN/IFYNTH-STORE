package product

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
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
	UpdateProduct(ctx *gin.Context)
	GetProductCountByDepartment(ctx *gin.Context)
	GetTotalCapital(ctx *gin.Context)
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
	department, _ := ctx.GetQuery("department")
	category, _ := ctx.GetQuery("category")

	res, err := h.service.GetAllProducts(ctx, keyword, department, category)
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

func (h *handler) AddProduct(ctx *gin.Context) {

	form, err := ctx.MultipartForm()
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	name := form.Value["name"]
	description := form.Value["description"]
	price := form.Value["price"]
	weight := form.Value["weight"]
	capital := form.Value["capital"]
	category := form.Value["category"]
	department := form.Value["department"]
	rawStockDetails := form.Value["stock_details"]
	images := form.File["images"]

	// Check if any required fields are missing
	if len(name) == 0 || len(description) == 0 || len(price) == 0 || len(category) == 0 || len(department) == 0 || len(rawStockDetails) == 0 || len(images) == 0 || len(weight) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "One or more required fields are missing"})
		return
	}

	// Validate image files
	for _, file := range images {
		if !isValidImage(file) {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": fmt.Sprintf("Invalid image format: %s", file.Filename),
			})
			return
		}
	}

	// Parse price and capital as float64
	priceValue, err := strconv.ParseFloat(price[0], 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}

	capitalValue, err := strconv.ParseFloat(capital[0], 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid capital format"})
		return
	}

	weightValue, err := strconv.ParseFloat(weight[0], 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid weight format"})
		return
	}

	// Parse the stock details from JSON
	var stockDetails []StockDetailInput
	if err := json.Unmarshal([]byte(rawStockDetails[0]), &stockDetails); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock_details format"})
		return
	}

	// Create the AddProductRequest
	req := AddProductRequest{
		Name:         name[0],
		Description:  description[0],
		Price:        priceValue,
		Weight:       weightValue,
		Capital:      capitalValue,
		Department:   department[0],
		Category:     category[0],
		Images:       images,
		StockDetails: stockDetails,
	}

	// Call the service to add the product
	if err := h.service.AddProduct(ctx.Request.Context(), req, images); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Return success response
	respond.Success(ctx, http.StatusCreated, gin.H{"message": "Product and images added successfully"})
}

func (h *handler) DeleteProduct(ctx *gin.Context) {
	productID := ctx.Param("id")
	if err := h.service.DeleteProduct(ctx.Request.Context(), productID); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func (h *handler) UpdateProduct(ctx *gin.Context) {
	bodyBytes, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(fmt.Errorf("error reading request body")))
		return
	}

	ctx.Request.Body = io.NopCloser(bytes.NewReader(bodyBytes))

	form, err := ctx.MultipartForm()
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	name := form.Value["name"]
	description := form.Value["description"]
	price := form.Value["price"]
	weight := form.Value["weight"]
	capital := form.Value["capital"]
	category := form.Value["category"]
	department := form.Value["department"]
	rawStockDetails := form.Value["stockDetails"]
	removedImages := form.Value["removedImages"]
	newImages := form.File["images"]

	if len(name) == 0 || len(description) == 0 || len(price) == 0 || len(category) == 0 || len(department) == 0 || len(rawStockDetails) == 0 || len(weight) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "One or more required fields are missing"})
		return
	}

	priceValue, err := strconv.ParseFloat(price[0], 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}

	weightValue, err := strconv.ParseFloat(weight[0], 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid weight format"})
		return
	}

	capitalValue, err := strconv.ParseFloat(capital[0], 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}

	var stockDetails []StockDetailInput
	if err := json.Unmarshal([]byte(rawStockDetails[0]), &stockDetails); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stockDetails format"})
		return
	}

	var removedImagesParsed []RemovedImage
	if err := json.Unmarshal([]byte(removedImages[0]), &removedImagesParsed); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid removedImages format"})
		return
	}

	for _, img := range removedImagesParsed {
		fmt.Println(img.ProductID)
		fmt.Println(img.URL)
	}

	req := UpdateProductRequest{
		Name:          name[0],
		Description:   description[0],
		Price:         priceValue,
		Weight:        weightValue,
		Capital:       capitalValue,
		Department:    department[0],
		Category:      category[0],
		StockDetails:  stockDetails,
		RemovedImages: removedImagesParsed,
		Images:        newImages,
	}

	if err := h.service.UpdateProduct(ctx.Request.Context(), ctx.Param("id"), req, newImages); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func (h *handler) GetProductCountByDepartment(ctx *gin.Context) {
	res, err := h.service.GetProductCountByDepartment(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) GetTotalCapital(ctx *gin.Context) {
	res, err := h.service.GetTotalCapital(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}
