package transaction

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

type Handler interface {
	AddTransaction(ctx *gin.Context)
	GetTransactionsByUserID(c *gin.Context)
	GetAllTransaction(ctx *gin.Context)
	UpdateTransactionStatus(ctx *gin.Context)
	GetTransactionCountByStatus(ctx *gin.Context)
	GetTotalAmountByDate(ctx *gin.Context)
	GetTotalIncome(ctx *gin.Context)
	GetTotalTransactionByCustomer(ctx *gin.Context)
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

func (h *handler) GetAllTransaction(ctx *gin.Context) {
	transactions, err := h.service.GetAllTransaction(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions", "details": err.Error()})
		return
	}

	if len(transactions) == 0 {
		ctx.JSON(http.StatusOK, gin.H{"message": "No transactions found"})
		return
	}

	respond.Success(ctx, http.StatusOK, transactions)
}

func (h *handler) GetTransactionsByUserID(ctx *gin.Context) {
	transactions, err := h.service.GetTransactionsByUserID(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions", "details": err.Error()})
		return
	}

	if len(transactions) == 0 {
		ctx.JSON(http.StatusOK, gin.H{"message": "No transactions found"})
		return
	}

	respond.Success(ctx, http.StatusOK, transactions)
}

func (h *handler) AddTransaction(ctx *gin.Context) {
	form, err := ctx.MultipartForm()
	if err != nil {
		respond.Error(ctx, errors.New("failed to parse multipart form"))
		return
	}

	get := func(key string) string {
		if val, ok := form.Value[key]; ok && len(val) > 0 {
			return val[0]
		}
		return ""
	}

	shippingCost, err := strconv.ParseFloat(get("shipping_cost"), 64)
	if err != nil {
		respond.Error(ctx, errors.New("invalid shipping_cost"))
		return
	}

	paymentProofHeader, err := ctx.FormFile("payment_proof")
	if err != nil && err.Error() != "http: no such file" {
		respond.Error(ctx, err)
		return
	}

	req := AddTransactionRequest{
		Name:             get("name"),
		PhoneNumber:      get("phone_number"),
		PaymentMethod:    get("payment_method"),
		PaymentProof:     paymentProofHeader,
		Address:          get("address"),
		ZipCode:          get("zip_code"),
		DestinationLabel: get("destination_label"),
		Courir:           get("courir"),
		ShippingCost:     shippingCost,
	}

	if err := h.service.AddTransaction(ctx, req, paymentProofHeader); err != nil {
		respond.Error(ctx, err)
		return
	}

	respond.Success(ctx, http.StatusCreated, gin.H{
		"message": "Transaction created successfully",
	})
}

func (h *handler) UpdateTransactionStatus(ctx *gin.Context) {
	var req UpdateStatusRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if req.TransactionID == "" || req.NewStatus == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "One or more required fields are missing"})
		return
	}

	if err := h.service.UpdateStatus(ctx, req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{"message": "status updated successfully"})
}

func (h *handler) GetTransactionCountByStatus(ctx *gin.Context) {
	res, err := h.service.GetTransactionCountByStatus(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) GetTotalAmountByDate(ctx *gin.Context) {
	transactions, err := h.service.GetTotalAmountByDate(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions", "details": err.Error()})
		return
	}

	if len(transactions) == 0 {
		ctx.JSON(http.StatusOK, gin.H{"message": "No transactions found"})
		return
	}

	respond.Success(ctx, http.StatusOK, transactions)
}

func (h *handler) GetTotalIncome(ctx *gin.Context) {
	res, err := h.service.GetTotalIncome(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) GetTotalTransactionByCustomer(ctx *gin.Context) {
	transactions, err := h.service.GetTotalTransactionByCustomer(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions", "details": err.Error()})
		return
	}

	if len(transactions) == 0 {
		ctx.JSON(http.StatusOK, gin.H{"message": "No transactions found"})
		return
	}

	respond.Success(ctx, http.StatusOK, transactions)
}
