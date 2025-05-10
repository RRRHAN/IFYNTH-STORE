package imageclassifier

import (
	"context"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"slices"

	"github.com/google/uuid"
	"gorm.io/gorm"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
)

type Service interface {
	Predict(ctx context.Context, file io.Reader, originalFilename string) (string, error)
}

type service struct {
	db        *gorm.DB
	predictor Predictor
}

func NewService(db *gorm.DB, predictor Predictor) Service {
	return &service{
		db:        db,
		predictor: predictor,
	}
}

func (s *service) Predict(ctx context.Context, file io.Reader, originalFilename string) (string, error) {
	// Get the file extension
	ext := filepath.Ext(originalFilename)

	// If the extension is not valid, return an error
	if !slices.Contains(ValidImageExtensions, ext) {
		return "", apierror.NewWarn(http.StatusBadRequest, "invalid image file extension: %s", ext)
	}

	// Create a temporary file
	tmpFile, err := os.CreateTemp("", "temp-image-"+uuid.NewString()+"*"+ext)
	if err != nil {
		return "", err
	}
	defer tmpFile.Close()

	// Copy the content of the uploaded file to the temporary file
	_, err = io.Copy(tmpFile, file)
	if err != nil {
		_ = os.Remove(tmpFile.Name())
		return "", err
	}

	return s.predictor.Predict(ctx, tmpFile.Name())
}
