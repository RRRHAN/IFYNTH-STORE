package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

type Handler interface {
	Login(ctx *gin.Context)
	VerifyToken(ctx *gin.Context)
	Logout(ctx *gin.Context)
	Register(ctx *gin.Context)
	ChangePassword(ctx *gin.Context)
	GetPersonal(ctx *gin.Context)
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
func (h *handler) GetPersonal(ctx *gin.Context) {
	res, err := h.service.GetPersonal(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) Login(ctx *gin.Context) {
	var input LoginReq
	if err := ctx.ShouldBindJSON(&input); err != nil {
		respond.Error(ctx, apierror.Warn(http.StatusBadRequest, err))
		return
	}

	err := h.validate.Struct(input)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	res, err := h.service.Login(ctx, input)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) VerifyToken(ctx *gin.Context) {
	respond.Success(ctx, http.StatusOK, VerifyTokenRes{TokenVerified: true})
}

func (h *handler) Logout(ctx *gin.Context) {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	input := LogoutReq{
		Token:   token.Token,
		Expires: token.Claims.ExpiresAt.Time,
	}

	res, err := h.service.Logout(ctx, input)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}

func (h *handler) Register(ctx *gin.Context) {

	var input RegisterReq
	if err := ctx.ShouldBindJSON(&input); err != nil {
		respond.Error(ctx, apierror.Warn(http.StatusBadRequest, err))
		return
	}

	err := h.validate.Struct(input)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	res, err := h.service.Register(ctx, input)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusCreated, res)
}

func (h *handler) ChangePassword(ctx *gin.Context) {
	var input ChangePasswordReq
	if err := ctx.ShouldBindJSON(&input); err != nil {
		respond.Error(ctx, apierror.Warn(http.StatusBadRequest, err))
		return
	}

	if err := h.validate.Struct(input); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	if err := h.service.ChangePassword(ctx, input); err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, gin.H{"message": "Password changed successfully"})
}
