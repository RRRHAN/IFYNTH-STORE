package product

import (
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

type Handler interface {
	GetAllProducts(ctx *gin.Context)
	AddProduct(ctx *gin.Context)
	DeleteProduct(ctx *gin.Context)
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

func (h *handler) AddProduct(ctx *gin.Context) {
	// Log permintaan mulai
	log.Println("Received request to add product")

	// Ambil data form
	form, err := ctx.MultipartForm()
	if err != nil {
		log.Printf("Error getting multipart form: %v\n", err)
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Ambil nilai dari form
	name := form.Value["name"]
	description := form.Value["description"]
	price := form.Value["price"]
	category := form.Value["category"]
	department := form.Value["department"]
	rawStockDetails := form.Value["stock_details"]
	images := form.File["images"]

	// Validasi field dasar
	if len(name) == 0 || len(description) == 0 || len(price) == 0 || len(category) == 0 || len(department) == 0 || len(rawStockDetails) == 0 || len(images) == 0 {
		log.Println("Missing required fields")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "One or more required fields are missing"})
		return
	}

	// Validasi format gambar
	for _, file := range images {
		if !isValidImage(file) { // Panggil isValidImage di sini
			log.Printf("Invalid image format: %s\n", file.Filename)
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": fmt.Sprintf("Invalid image format: %s", file.Filename),
			})
			return
		}
	}

	// Konversi harga
	priceValue, err := strconv.ParseFloat(price[0], 64)
	if err != nil {
		log.Printf("Error parsing price: %v\n", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid price format"})
		return
	}

	// Parsing stock details
	var stockDetails []StockDetailInput
	if err := json.Unmarshal([]byte(rawStockDetails[0]), &stockDetails); err != nil {
		log.Printf("Error parsing stock_details: %v\n", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid stock_details format"})
		return
	}

	// Isi struct AddProductRequest
	req := AddProductRequest{
		Name:         name[0],
		Description:  description[0],
		Price:        priceValue,
		Department:   department[0],
		Category:     category[0],
		Images:       images,
		StockDetails: stockDetails,
	}

	// Panggil service untuk menambahkan produk
	if err := h.service.AddProduct(ctx.Request.Context(), req, images); err != nil {
		log.Printf("Error in AddProduct service: %v\n", err)
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	// Log sukses
	log.Println("Product and images added successfully")
	respond.Success(ctx, http.StatusCreated, gin.H{"message": "Product and images added successfully"})
}

// Fungsi untuk memvalidasi tipe file gambar
func isValidImage(file *multipart.FileHeader) bool {
	// Cek ekstensi file
	ext := filepath.Ext(file.Filename)
	allowedExt := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
	}

	return allowedExt[ext]
}

func (h *handler) DeleteProduct(ctx *gin.Context) {
	productID := ctx.Param("id") // Assuming the product ID is passed as a URL parameter

	if err := h.service.DeleteProduct(ctx.Request.Context(), productID); err != nil {
		log.Printf("Error deleting product: %v\n", err)
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	log.Println("Product deleted successfully")
	respond.Success(ctx, http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
