package product

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/google/uuid"
)

type Service interface {
	GetAllProducts(ctx context.Context, keyword string) ([]Product, error)
	AddProduct(ctx context.Context, req AddProductRequest, images []*multipart.FileHeader) error
	DeleteProduct(ctx context.Context, productID string) error
}

type service struct {
	authConfig config.Auth
	db         *gorm.DB
}

func NewService(config *config.Config, db *gorm.DB) Service {
	return &service{
		authConfig: config.Auth,
		db:         db,
	}
}

func (s *service) GetAllProducts(ctx context.Context, keyword string) ([]Product, error) {
	var products []Product

	query := s.db.WithContext(ctx).Model(&Product{}).Preload("ProductImages").Preload("StockDetails")

	if keyword != "" {
		// Search name OR description
		query = query.Where(
			"name ILIKE ? OR description ILIKE ?",
			"%"+keyword+"%",
			"%"+keyword+"%",
		)
	}

	if err := query.Order("created_at DESC").Find(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
}

func (s *service) AddProduct(ctx context.Context, req AddProductRequest, images []*multipart.FileHeader) error {
	// Hitung total stok berdasarkan detail stok per ukuran
	totalStock := 0
	for _, detail := range req.StockDetails {
		totalStock += int(detail.Stock)
	}

	// Buat entri produk
	product := Product{
		ID:          uuid.New(),
		Name:        req.Name,
		TotalStock:  totalStock, // Total stok dihitung berdasarkan stok per ukuran
		Description: req.Description,
		Price:       req.Price,
		Department:  req.Department,
		Category:    req.Category, // Menambahkan Category
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Simpan produk ke database
	if err := s.db.Create(&product).Error; err != nil {
		return err
	}

	// Simpan gambar-gambar jika ada
	var productImages []ProductImage
	for i, file := range images {
		// Simpan gambar ke disk dengan format nama yang unik
		ext := filepath.Ext(file.Filename)
		filename := fmt.Sprintf("%s_%d%s", product.ID.String(), i+1, ext)
		path := filepath.Join("uploads", "products", filename)

		// Pastikan folder tujuan ada
		if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}

		// Simpan gambar menggunakan helper
		if err := s.saveImage(ctx, file, path); err != nil {
			return err
		}

		// Tambahkan ke list gambar
		productImages = append(productImages, ProductImage{
			ProductID: product.ID,
			URL:       "/uploads/products/" + filename,
			CreatedAt: time.Now(),
		})
	}

	// Simpan gambar ke database jika ada
	if len(productImages) > 0 {
		if err := s.db.Create(&productImages).Error; err != nil {
			return err
		}
	}

	// Simpan detail stok berdasarkan ukuran
	var stockDetails []ProductStockDetail
	for _, detail := range req.StockDetails {
		stockDetails = append(stockDetails, ProductStockDetail{
			ProductID: product.ID,
			Size:      detail.Size,
			Stock:     detail.Stock,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		})
	}

	// Simpan detail stok ke database
	if len(stockDetails) > 0 {
		if err := s.db.Create(&stockDetails).Error; err != nil {
			return err
		}
	}

	return nil
}

// Helper function to save image
func (s *service) saveImage(ctx context.Context, file *multipart.FileHeader, path string) error {
	// Open file from memory
	src, err := file.Open()
	if err != nil {
		return fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer src.Close()

	// Create the destination file on the disk
	dst, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("failed to create file on disk: %w", err)
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	if _, err := io.Copy(dst, src); err != nil {
		return fmt.Errorf("failed to copy file to disk: %w", err)
	}

	return nil
}

func (s *service) DeleteProduct(ctx context.Context, productID string) error {
	// Find the product by ID to ensure it exists
	var product Product
	if err := s.db.WithContext(ctx).First(&product, "id = ?", productID).Error; err != nil {
		return fmt.Errorf("product not found: %v", err)
	}

	// Delete related stock details for the product
	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Delete(&ProductStockDetail{}).Error; err != nil {
		return fmt.Errorf("error deleting product stock details: %v", err)
	}

	// Fetch product images before deleting them
	var productImages []ProductImage
	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Find(&productImages).Error; err != nil {
		return fmt.Errorf("error fetching product images: %v", err)
	}

	// Hapus gambar dari disk
	for _, image := range productImages {
		cleanFileName := strings.TrimPrefix(image.URL, "/")
		imagePath := filepath.Join(cleanFileName) // Menggunakan nama file dari database
		if err := os.Remove(imagePath); err != nil {
			return fmt.Errorf("error deleting image file %s: %v", image.URL, err)
		}
	}

	// Delete related images for the product
	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Delete(&ProductImage{}).Error; err != nil {
		return fmt.Errorf("error deleting product images: %v", err)
	}

	// Delete the product itself
	if err := s.db.WithContext(ctx).Delete(&product).Error; err != nil {
		return fmt.Errorf("error deleting product: %v", err)
	}

	return nil
}
