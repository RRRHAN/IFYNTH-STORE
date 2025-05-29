package product

import (
	"context"
	"errors"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	fileutils "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/file"
	"github.com/google/uuid"
)

type Service interface {
	GetAllProducts(ctx context.Context, keyword string, department string, category string) ([]Product, error)
	GetProductByID(ctx context.Context, id uuid.UUID) (*Product, error)
	AddProduct(ctx context.Context, req AddProductRequest) error
	UpdateProduct(ctx context.Context, productID string, req UpdateProductRequest, images []*multipart.FileHeader) error
	DeleteProduct(ctx context.Context, productID string) error
	GetProductCountByDepartment(ctx context.Context) ([]DepartmentCount, error)
	GetTotalCapital(ctx context.Context) (float64, error)
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

func (s *service) GetAllProducts(ctx context.Context, keyword string, department string, category string) ([]Product, error) {
	var products []Product

	query := s.db.WithContext(ctx).Model(&Product{}).Preload("ProductImages").Preload("StockDetails").Preload("ProductCapital")

	if keyword != "" {
		// Search name OR description
		query = query.Where(
			"name ILIKE ? OR description ILIKE ?",
			"%"+keyword+"%",
			"%"+keyword+"%",
		)
	}

	if department != "" {
		query = query.Where("department = ?", department)
	}

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if err := query.Order("created_at DESC").Find(&products).Error; err != nil {
		return nil, err
	}

	return products, nil
}

func (s *service) GetProductByID(ctx context.Context, id uuid.UUID) (*Product, error) {
	var product Product

	if err := s.db.WithContext(ctx).Model(&Product{}).
		Preload("ProductImages").Preload("StockDetails").Preload("ProductCapital").
		Where("id = ?", id).
		First(&product).Error; err != nil {
		return nil, err
	}

	return &product, nil
}

func (s *service) AddProduct(ctx context.Context, req AddProductRequest) error {
	totalStock := 0
	for _, detail := range req.StockDetails {
		totalStock += int(detail.Stock)
	}

	product := Product{
		ID:          uuid.New(),
		Name:        req.Name,
		TotalStock:  totalStock,
		Description: req.Description,
		Price:       req.Price,
		Weight:      req.Weight,
		Department:  req.Department,
		Category:    req.Category,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// save to db
	if err := s.db.Create(&product).Error; err != nil {
		return err
	}

	// Save capital info to ProductCapital table
	productCapital := ProductCapital{
		ID:             uuid.New(),
		ProductID:      product.ID,
		TotalStock:     totalStock,
		CapitalPerItem: req.Capital,
		TotalCapital:   float64(totalStock) * req.Capital,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if err := s.db.Create(&productCapital).Error; err != nil {
		return fmt.Errorf("failed to save capital: %w", err)
	}

	// save img if exist
	var productImages []ProductImage
	for _, file := range req.Images {
		ext := filepath.Ext(file.Filename)

		filename, err := fileutils.GenerateMediaName(product.ID.String())
		if err != nil {
			return fmt.Errorf("error generating image name: %v", err)
		}

		filename = fmt.Sprintf("%s%s", filename, ext)
		path := filepath.Join("uploads", "products", filename)

		if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}

		if err := fileutils.SaveMedia(ctx, file, path); err != nil {
			return err
		}

		productImages = append(productImages, ProductImage{
			ProductID: product.ID,
			URL:       "/uploads/products/" + filename,
			CreatedAt: time.Now(),
		})
	}

	if len(productImages) > 0 {
		if err := s.db.Create(&productImages).Error; err != nil {
			return err
		}
	}

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

	if len(stockDetails) > 0 {
		if err := s.db.Create(&stockDetails).Error; err != nil {
			return err
		}
	}

	return nil
}

func (s *service) DeleteProduct(ctx context.Context, productID string) error {
	var product Product
	if err := s.db.WithContext(ctx).First(&product, "id = ?", productID).Error; err != nil {
		return fmt.Errorf("product not found: %v", err)
	}

	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Delete(&ProductCapital{}).Error; err != nil {
		return fmt.Errorf("error deleting product capital details: %v", err)
	}

	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Delete(&ProductStockDetail{}).Error; err != nil {
		return fmt.Errorf("error deleting product stock details: %v", err)
	}

	var productImages []ProductImage
	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Find(&productImages).Error; err != nil {
		return fmt.Errorf("error fetching product images: %v", err)
	}

	for _, image := range productImages {
		cleanFileName := strings.TrimPrefix(image.URL, "/")
		imagePath := filepath.Join(cleanFileName)
		if err := os.Remove(imagePath); err != nil {
			return fmt.Errorf("error deleting image file %s: %v", image.URL, err)
		}
	}

	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Delete(&ProductImage{}).Error; err != nil {
		return fmt.Errorf("error deleting product images: %v", err)
	}

	if err := s.db.WithContext(ctx).Delete(&product).Error; err != nil {
		return fmt.Errorf("error deleting product: %v", err)
	}

	return nil
}

func (s *service) UpdateProduct(ctx context.Context, productID string, req UpdateProductRequest, images []*multipart.FileHeader) error {
	var product Product
	if err := s.db.WithContext(ctx).First(&product, "id = ?", productID).Error; err != nil {
		return fmt.Errorf("product not found: %v", err)
	}

	totalStock := 0
	for _, detail := range req.StockDetails {
		totalStock += int(detail.Stock)
	}

	product.Name = req.Name
	product.TotalStock = totalStock
	product.Description = req.Description
	product.Price = req.Price
	product.Weight = req.Weight
	product.Department = req.Department
	product.Category = req.Category
	product.UpdatedAt = time.Now()

	if err := s.db.WithContext(ctx).Save(&product).Error; err != nil {
		return fmt.Errorf("error updating product: %v", err)
	}

	for _, removedImage := range req.RemovedImages {
		cleanFileName := strings.TrimPrefix(removedImage.URL, "/")
		fmt.Printf("Clean File Name: %s\n", cleanFileName)
		imagePath := filepath.Join(cleanFileName)

		if _, err := os.Stat(imagePath); err == nil {
			if err := os.Remove(imagePath); err != nil {
				return fmt.Errorf("error deleting image file %s: %v", removedImage.URL, err)
			}
		} else if os.IsNotExist(err) {
			fmt.Printf("File not found: %s\n", imagePath)
		} else {
			return fmt.Errorf("error checking file %s: %v", removedImage.URL, err)
		}

		if err := s.db.WithContext(ctx).Where("product_id = ? AND url = ?", removedImage.ProductID, removedImage.URL).Delete(&ProductImage{}).Error; err != nil {
			return fmt.Errorf("error deleting image from database: %v", err)
		}

	}

	var capital ProductCapital
	err := s.db.WithContext(ctx).First(&capital, "product_id = ?", product.ID).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {

			capital = ProductCapital{
				ID:             uuid.New(),
				ProductID:      product.ID,
				TotalStock:     totalStock,
				CapitalPerItem: req.Capital,
				TotalCapital:   req.Capital * float64(totalStock),
				CreatedAt:      time.Now(),
				UpdatedAt:      time.Now(),
			}
			if err := s.db.Create(&capital).Error; err != nil {
				return fmt.Errorf("error creating product capital: %v", err)
			}
		} else {
			return fmt.Errorf("error finding product capital: %v", err)
		}
	} else {

		capital.TotalStock = totalStock
		capital.CapitalPerItem = req.Capital
		capital.TotalCapital = req.Capital * float64(totalStock)
		capital.UpdatedAt = time.Now()

		if err := s.db.Save(&capital).Error; err != nil {
			return fmt.Errorf("error updating product capital: %v", err)
		}
	}

	var productImages []ProductImage
	for _, file := range images {
		ext := filepath.Ext(file.Filename)

		filename, err := fileutils.GenerateMediaName(product.ID.String())
		if err != nil {
			return fmt.Errorf("error generating image name: %v", err)
		}

		filename = fmt.Sprintf("%s%s", filename, ext)
		path := filepath.Join("uploads", "products", filename)

		if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}
		if err := fileutils.SaveMedia(ctx, file, path); err != nil {
			return err
		}

		productImages = append(productImages, ProductImage{
			ProductID: product.ID,
			URL:       "/uploads/products/" + filename,
			CreatedAt: time.Now(),
		})
	}

	if len(productImages) > 0 {
		if err := s.db.Create(&productImages).Error; err != nil {
			return fmt.Errorf("error saving new images: %v", err)
		}
	}

	for _, existingDetail := range req.StockDetails {
		found := false
		for _, detail := range req.StockDetails {
			if detail.Size == existingDetail.Size {
				found = true
				break
			}
		}
		if !found {
			if err := s.db.WithContext(ctx).Delete(&existingDetail).Error; err != nil {
				return fmt.Errorf("error deleting old stock detail: %v", err)
			}
		}
	}

	for _, detail := range req.StockDetails {
		var existingStockDetail ProductStockDetail
		if err := s.db.WithContext(ctx).First(&existingStockDetail, "product_id = ? AND size = ?", product.ID, detail.Size).Error; err != nil {

			if err := s.db.WithContext(ctx).Create(&ProductStockDetail{
				ProductID: product.ID,
				Size:      detail.Size,
				Stock:     detail.Stock,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}).Error; err != nil {
				return fmt.Errorf("error adding new stock detail: %v", err)
			}
		} else {
			existingStockDetail.Stock = detail.Stock
			existingStockDetail.UpdatedAt = time.Now()

			if err := s.db.WithContext(ctx).Save(&existingStockDetail).Error; err != nil {
				return fmt.Errorf("error updating stock detail: %v", err)
			}
		}
	}

	return nil
}

func (s *service) GetProductCountByDepartment(ctx context.Context) ([]DepartmentCount, error) {
	var results []DepartmentCount

	if err := s.db.WithContext(ctx).
		Model(&Product{}).
		Select("department, COUNT(*) as count").
		Group("department").
		Scan(&results).Error; err != nil {
		return nil, err
	}

	return results, nil
}

func (s *service) GetTotalCapital(ctx context.Context) (float64, error) {
	var totalCapital float64

	if err := s.db.WithContext(ctx).
		Model(&ProductCapital{}).
		Select("COALESCE(SUM(total_capital), 0)").
		Scan(&totalCapital).Error; err != nil {
		return 0, err
	}

	return totalCapital, nil
}
