package imageclassifier

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

type Handler interface {
	Predict(ctx *gin.Context)
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

func (h *handler) Predict(ctx *gin.Context) {
	file, err := ctx.FormFile("image")
	if err != nil {
		respond.Error(ctx, apierror.NewWarn(http.StatusBadRequest, "File is required"))
		return
	}

	// Open the uploaded file
	src, err := file.Open()
	if err != nil {
		respond.Error(ctx, apierror.NewWarn(http.StatusBadRequest, "Cannot open uploaded file"))
		return
	}
	defer src.Close()

	res, err := h.service.Predict(ctx, src, file.Filename)
	if err != nil {
		respond.Error(ctx, apierror.FromErr(err))
		return
	}

	respond.Success(ctx, http.StatusOK, res)
}
