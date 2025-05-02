package product

import (
	"context"
	"crypto/rand"
	"fmt"
	"io"
	"math/big"
	"mime/multipart"
	"os"
	"path/filepath"
)

// func helper
func generateImageName(productID string) (string, error) {
	imageID, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return "", fmt.Errorf("error generating random number: %v", err)
	}
	filename := fmt.Sprintf("%s_%d", productID, imageID.Int64())

	return filename, nil
}

func (s *service) saveImage(ctx context.Context, file *multipart.FileHeader, path string) error {
	src, err := file.Open()
	if err != nil {
		return fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	dst, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("failed to create file on disk: %w", err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return fmt.Errorf("failed to copy file to disk: %w", err)
	}

	return nil
}

func isValidImage(file *multipart.FileHeader) bool {
	ext := filepath.Ext(file.Filename)
	allowedExt := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
	}

	return allowedExt[ext]
}
