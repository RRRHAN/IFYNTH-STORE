package cusproduct

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/message"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/constants"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
	fileutils "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/file"
	"github.com/google/uuid"
)

type Service interface {
	GetAllProducts(ctx context.Context, keyword string) ([]ProductWithCustomer, error)
	GetProductByID(ctx context.Context, id uuid.UUID) (*CustomerProduct, error)
	AddProduct(ctx context.Context, req AddProductRequest) error
	DeleteProduct(ctx context.Context, req DeleteProductRequest) error
	GetProductByUserID(ctx context.Context, keyword string) ([]CustomerProduct, error)
	UpdateStatus(ctx context.Context, req UpdateStatusRequest) error
	GetProductByMessage(ctx context.Context, keyword string) ([]CustomerProductMessage, error)
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

func (s *service) GetAllProducts(ctx context.Context, keyword string) ([]ProductWithCustomer, error) {
	var products []CustomerProduct

	// Query utama dengan preload Files
	query := s.db.WithContext(ctx).
		Model(&CustomerProduct{}).
		Preload("Files")

	if keyword != "" {
		query = query.Where(
			"name ILIKE ? OR description ILIKE ?",
			"%"+keyword+"%",
			"%"+keyword+"%",
		)
	}

	// Jalankan query utama
	if err := query.Order("created_at DESC").Find(&products).Error; err != nil {
		return nil, err
	}

	// Kumpulkan semua user ID
	userIDs := make([]uuid.UUID, 0, len(products))
	for _, p := range products {
		userIDs = append(userIDs, p.UserID)
	}

	var users []userNameMap
	if err := s.db.WithContext(ctx).
		Table("customer").
		Select("id, name").
		Where("id IN ?", userIDs).
		Scan(&users).Error; err != nil {
		return nil, err
	}

	// Buat map userID ke nama
	userNameMapData := make(map[uuid.UUID]string)
	for _, u := range users {
		userNameMapData[u.ID] = u.Name
	}

	var unreads []Unread
	err := s.db.Model(&message.Message{}).
		Select("product_id, COUNT(*) as total").
		Where("is_read = ? ", false).
		Where("role = ? ", constants.CUSTOMER).
		Group("product_id").
		Scan(&unreads).Error
	if err != nil {
		return nil, err
	}

	mapUnreadCount := make(map[uuid.UUID]int, 0)
	for _, unread := range unreads {
		mapUnreadCount[unread.ProductID] = unread.Total
	}

	// Gabungkan hasil
	var result []ProductWithCustomer
	for _, p := range products {
		result = append(result, ProductWithCustomer{
			CustomerProduct: p,
			CustomerName:    userNameMapData[p.UserID],
			UnreadCount:     mapUnreadCount[p.ID],
		})
	}

	return result, nil
}

func (s *service) GetProductByUserID(ctx context.Context, keyword string) ([]CustomerProduct, error) {
	var products []CustomerProduct

	token, _ := contextUtil.GetTokenClaims(ctx)

	query := s.db.WithContext(ctx).Model(&CustomerProduct{}).Preload("Files").Where("user_id = ?", token.Claims.UserID)

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

func (s *service) GetProductByMessage(ctx context.Context, keyword string) ([]CustomerProductMessage, error) {
	var products []CustomerProduct

	token, _ := contextUtil.GetTokenClaims(ctx)

	subQuery := s.db.Model(&message.Message{}).Select("product_id")

	query := s.db.WithContext(ctx).
		Model(&CustomerProduct{}).
		Preload("Files").
		Where("user_id = ?", token.Claims.UserID).
		Where("id IN (?)", subQuery)

	if keyword != "" {
		query = query.Where(
			"name ILIKE ? OR description ILIKE ?",
			"%"+keyword+"%",
			"%"+keyword+"%",
		)
	}

	if err := query.Order("created_at DESC").Find(&products).Error; err != nil {
		return nil, err
	}

	var results []Unread
	err := s.db.Model(&message.Message{}).
		Select("product_id, COUNT(*) as total").
		Where("is_read = ? ", false).
		Where("role = ? ", constants.ADMIN).
		Group("product_id").
		Scan(&results).Error
	if err != nil {
		return nil, err
	}

	mapUnreadCount := make(map[uuid.UUID]int, 0)
	for _, result := range results {
		mapUnreadCount[result.ProductID] = result.Total
	}

	var productMessages []CustomerProductMessage
	for _, product := range products {
		url := ""
		if len(product.Files) != 0 {
			url = product.Files[0].URL
		}
		productMessages = append(productMessages, CustomerProductMessage{
			ProductID:   product.ID,
			Name:        product.Name,
			Price:       product.Price,
			Status:      product.Status,
			URL:         url,
			UnreadCount: mapUnreadCount[product.ID],
		})
	}

	return productMessages, nil
}

func (s *service) GetProductByID(ctx context.Context, id uuid.UUID) (*CustomerProduct, error) {
	var product CustomerProduct

	if err := s.db.WithContext(ctx).Model(&CustomerProduct{}).
		Preload("Files").
		Where("id = ?", id).
		First(&product).Error; err != nil {
		return nil, err
	}

	return &product, nil
}

func (s *service) AddProduct(ctx context.Context, req AddProductRequest) error {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}
	// Product entry
	product := CustomerProduct{
		ID:          uuid.New(),
		UserID:      token.Claims.UserID,
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Status:      "pending",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// save to db
	if err := s.db.Create(&product).Error; err != nil {
		return err
	}

	var productMedia []CustomerProductFile
	for _, file := range req.Files {
		ext := filepath.Ext(file.Filename)
		filename, err := fileutils.GenerateMediaName(product.ID.String())
		if err != nil {
			return fmt.Errorf("error generating media name: %v", err)
		}

		filename = fmt.Sprintf("%s%s", filename, ext)
		var path string

		// Check if it's an image or video based on file extension
		if fileutils.IsVideo(ext) {
			path = filepath.Join("uploads", "cus_products", "videos", filename)
		} else {
			path = filepath.Join("uploads", "cus_products", "images", filename)
		}

		// Create directories if needed
		if err := os.MkdirAll(filepath.Dir(path), os.ModePerm); err != nil {
			return fmt.Errorf("failed to create directory: %w", err)
		}

		// Save the file to disk
		if err := fileutils.SaveMedia(ctx, file, path); err != nil {
			return err
		}

		// Add to the product media list
		productMedia = append(productMedia, CustomerProductFile{
			ProductID: product.ID,
			URL:       "/" + path,
			CreatedAt: time.Now(),
		})
	}

	// Save media to db
	if len(productMedia) > 0 {
		if err := s.db.Create(&productMedia).Error; err != nil {
			return err
		}
	}

	return nil
}

func (s *service) DeleteProduct(ctx context.Context, req DeleteProductRequest) error {
	var productID = req.ProductID

	var product CustomerProduct
	if err := s.db.WithContext(ctx).First(&product, "id = ?", productID).Error; err != nil {
		return fmt.Errorf("product not found: %v", err)
	}

	var productImages []CustomerProductFile
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

	if err := s.db.WithContext(ctx).Where("product_id = ?", productID).Delete(&CustomerProductFile{}).Error; err != nil {
		return fmt.Errorf("error deleting product images: %v", err)
	}

	if err := s.db.WithContext(ctx).Delete(&product).Error; err != nil {
		return fmt.Errorf("error deleting product: %v", err)
	}

	return nil
}

func (s *service) UpdateStatus(ctx context.Context, req UpdateStatusRequest) error {
	var product CustomerProduct

	// Cek apakah produk dengan ID tersebut ada
	if err := s.db.WithContext(ctx).First(&product, "id = ?", req.ProductID).Error; err != nil {
		return fmt.Errorf("product not found: %v", err)
	}

	// Update status produk
	product.Status = req.NewStatus
	if err := s.db.WithContext(ctx).Save(&product).Error; err != nil {
		return fmt.Errorf("failed to update product status: %v", err)
	}

	return nil
}
