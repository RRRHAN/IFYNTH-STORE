package address

import (
	"net/http"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type Handler interface {
	GetAdderess(ctx *gin.Context)
	InsertAddress(ctx *gin.Context)
	UpdateAddress(ctx *gin.Context)
	DeleteAddress(ctx *gin.Context)
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

func (h *handler) GetAdderess(ctx *gin.Context) {
	res, err := h.service.GetAdderess(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)

}
func (h *handler) InsertAddress(ctx *gin.Context) {
	var req AddressReq

	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.validate.Struct(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	res, err := h.service.InsertAddress(ctx, req)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, res)
}
func (h *handler) UpdateAddress(ctx *gin.Context) {

	id := ctx.Param("id")
	addressId, err := uuid.Parse(id)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	var req AddressReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.validate.Struct(&req); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	res, err := h.service.UpdateAddress(ctx, addressId, req)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}
func (h *handler) DeleteAddress(ctx *gin.Context) {
	id := ctx.Param("id")
	addressId, err := uuid.Parse(id)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	err = h.service.DeleteAddress(ctx, addressId)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, nil)
}
