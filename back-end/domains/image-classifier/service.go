package imageclassifier

import (
	"context"
	"io"

	"gorm.io/gorm"
)

type Service interface {
	Predict(ctx context.Context, file io.Reader) (string, error)
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

func (s *service) Predict(ctx context.Context, file io.Reader) (string, error) {
	return "", nil
}
