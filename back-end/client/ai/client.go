package ai

import (
	"context"
	"mime/multipart"
	"net/http"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
	"github.com/go-resty/resty/v2"
)

type Client interface {
	PredictImage(ctx context.Context, fileHeader *multipart.FileHeader) (*PredictImageData, error)
}

type client struct {
	resty *resty.Client
}

func NewClient(conf *config.Config) Client {
	c := resty.New().
		SetBaseURL(conf.AIBaseUrl)

	return &client{
		resty: c,
	}
}

func (c *client) PredictImage(ctx context.Context, fileHeader *multipart.FileHeader) (*PredictImageData, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return nil, apierror.NewError(http.StatusInternalServerError, "Failed to open image")
	}
	defer file.Close()

	var res respond.ApiModel[*PredictImageData]
	resp, err := c.resty.R().
		SetContext(ctx).
		SetFileReader("image", fileHeader.Filename, file).
		SetResult(&res).
		SetError(&res).
		Get("/ai/predict-image")

	if err != nil {
		return nil, err
	}

	if len(res.Errors) != 0 {
		return nil, apierror.NewError(resp.StatusCode(), res.Errors...)
	}

	return res.Data, nil
}
