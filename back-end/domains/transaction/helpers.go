package transaction

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"time"
)

// Example of image validation function
func isValidImageExtension(ext string) bool {
	validExtensions := []string{".jpg", ".jpeg", ".png", ".gif"}
	for _, validExt := range validExtensions {
		if ext == validExt {
			return true
		}
	}
	return false
}

// Helper function to generate a name for media files
func generateMediaName(productID string) (string, error) {
	// Generate a unique name for the media file
	return fmt.Sprintf("%s_%d", productID, time.Now().UnixNano()), nil
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
