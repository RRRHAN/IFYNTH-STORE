package cusproduct

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func isValidImage(file *multipart.FileHeader) bool {
	ext := strings.ToLower(filepath.Ext(file.Filename))
	validImageExtensions := []string{".jpg", ".jpeg", ".png", ".gif", ".bmp"}

	for _, validExt := range validImageExtensions {
		if ext == validExt {
			return true
		}
	}
	return false
}

func isValidVideo(file *multipart.FileHeader) bool {
	ext := strings.ToLower(filepath.Ext(file.Filename))
	validVideoExtensions := []string{".mp4", ".avi", ".mov", ".mkv", ".flv", ".webm"}

	for _, validExt := range validVideoExtensions {
		if ext == validExt {
			return true
		}
	}
	return false
}

// Helper function to check if a file extension is a video
func isVideo(extension string) bool {
	// List of video file extensions
	videoExtensions := []string{".mp4", ".avi", ".mov", ".mkv", ".flv", ".webm"}
	for _, ext := range videoExtensions {
		if strings.ToLower(extension) == ext {
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

func (s *service) saveMedia(ctx context.Context, file *multipart.FileHeader, path string) error {
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
