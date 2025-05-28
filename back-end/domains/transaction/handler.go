package transaction

import (
	"net/http"

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
		respond.Success(ctx, http.StatusOK, "No transactions found")
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
		respond.Success(ctx, http.StatusOK, "No transactions found")
		return
	}

	respond.Success(ctx, http.StatusOK, transactions)
}

func (h *handler) AddTransaction(ctx *gin.Context) {

	var input AddTransactionRequest
	err := ctx.ShouldBind(&input)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.service.AddTransaction(ctx, input); err != nil {
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
		respond.Error(ctx, apierror.NewWarn(http.StatusBadRequest, "One or more required fields are missing"))
		return
	}

	if err := h.service.UpdateStatus(ctx, req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, "status updated successfully")
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
		respond.Success(ctx, http.StatusOK, "No transactions found")
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
		respond.Success(ctx, http.StatusOK, "No transactions found")
		return
	}

	respond.Success(ctx, http.StatusOK, transactions)
}
