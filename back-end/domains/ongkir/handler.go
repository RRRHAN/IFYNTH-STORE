package ongkir

import (
	"net/http"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type Handler interface {
	GetDestination(ctx *gin.Context)
	GetShippingCost(ctx *gin.Context)
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

func (h *handler) GetDestination(ctx *gin.Context) {
	keyword := ctx.Param("keyword")
	res, err := h.service.GetDestination(ctx, keyword)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, res)
}

func (h *handler) GetShippingCost(ctx *gin.Context) {
	var req GetShippingCostReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.validate.Struct(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	res, err := h.service.GetShippingCost(ctx, req)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, res)
}
