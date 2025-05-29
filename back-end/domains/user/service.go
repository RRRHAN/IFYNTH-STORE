package user

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"gorm.io/gorm"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/constants"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
)

type Service interface {
	Login(ctx context.Context, input LoginReq) (res *LoginRes, err error)
	Logout(ctx context.Context, input LogoutReq) (res *LogoutRes, err error)
	ValidateToken(ctx context.Context, token string) (err error)
	Register(ctx context.Context, input RegisterReq) (res *Customer, err error)
	RegisterAdmin(ctx context.Context, input RegisterReq) (res *Admin, err error)
	ChangePassword(ctx context.Context, input ChangePasswordReq) error
	GetPersonal(ctx context.Context) (interface{}, error)
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

func (s *service) GetPersonal(ctx context.Context) (interface{}, error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, err
	}

	switch token.Claims.Role {
	case "ADMIN":
		var admin Admin
		err = s.db.WithContext(ctx).Where("id = ?", token.Claims.UserID).First(&admin).Error
		if err != nil {
			return nil, err
		}
		return &admin, nil

	case "CUSTOMER":
		var customer Customer
		err = s.db.WithContext(ctx).Where("id = ?", token.Claims.UserID).First(&customer).Error
		if err != nil {
			return nil, err
		}
		return &customer, nil

	default:
		return nil, errors.New("invalid role")
	}
}

func (s *service) Login(ctx context.Context, input LoginReq) (*LoginRes, error) {

	var err error
	var userID uuid.UUID
	switch input.Role {
	case constants.ADMIN:
		var admin Admin
		if err = s.db.WithContext(ctx).Where("username = ?", input.Username).First(&admin).Error; err == nil {
			if !comparePassword(admin.Password, input.Password) {
				return nil, apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCredentials)
			}
			userID = admin.ID
		}
	case constants.CUSTOMER:
		var customer Customer
		if err = s.db.WithContext(ctx).Where("username = ?", input.Username).First(&customer).Error; err == nil {
			if !comparePassword(customer.Password, input.Password) {
				return nil, apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCredentials)
			}
			userID = customer.ID
		}
	}

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCredentials)
		}
		return nil, err
	}

	expirationTime := time.Now().Add(s.authConfig.JWT.ExpireIn)
	claims := &constants.JWTClaims{
		UserID:   userID,
		Username: input.Username,
		Role:     input.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.authConfig.JWT.SecretKey))
	if err != nil {
		return nil, apierror.FromErr(err)
	}

	var totalQuantity int64
	result := s.db.WithContext(ctx).
		Table("carts").
		Where("user_id = ?", userID).
		Select("COALESCE(total_quantity, 0)").
		Scan(&totalQuantity)

	if result.Error != nil {
		return nil, apierror.FromErr(result.Error)
	}

	return &LoginRes{
		Token:         tokenString,
		Expires:       expirationTime,
		TotalQuantity: totalQuantity,
	}, nil
}

func (s *service) Logout(ctx context.Context, input LogoutReq) (res *LogoutRes, err error) {

	err = s.db.WithContext(ctx).Create(InvalidToken{
		Token:   input.Token,
		Expires: input.Expires,
	}).Error
	if err != nil {
		return nil, err
	}

	return &LogoutRes{
		LoggedOut: true,
	}, nil
}

func (s *service) ValidateToken(ctx context.Context, token string) (err error) {

	var invalidToken InvalidToken
	if err := s.db.WithContext(ctx).Where("token = ?", token).First(&invalidToken).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil
		}
		return err
	}

	return nil
}

func (s *service) Register(ctx context.Context, input RegisterReq) (res *Customer, err error) {

	// Hash password
	hashedPassword, err := hashPassword(input.Password)
	if err != nil {
		return nil, apierror.FromErr(err)
	}

	// Build customer object
	customer := Customer{
		Name:        input.Name,
		PhoneNumber: input.PhoneNumber,
		Username:    input.Username,
		Password:    hashedPassword,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Insert into DB
	if err := s.db.WithContext(ctx).Create(&customer).Error; err != nil {
		return nil, apierror.FromErr(err)
	}

	return &customer, nil
}

func (s *service) RegisterAdmin(ctx context.Context, input RegisterReq) (res *Admin, err error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, err
	}
	loggedInUsername := token.Claims.Username
	if loggedInUsername != "owner" {
		return nil, errors.New("unauthorized: only owners can register admins")
	}

	// Hash password
	hashedPassword, err := hashPassword(input.Password)
	if err != nil {
		return nil, apierror.FromErr(err)
	}

	// Build admin object
	admin := Admin{
		Name:        input.Name,
		PhoneNumber: input.PhoneNumber,
		Username:    input.Username,
		Password:    hashedPassword,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Insert into DB
	if err := s.db.WithContext(ctx).Create(&admin).Error; err != nil {
		return nil, apierror.FromErr(err)
	}

	return &admin, nil
}

func (s *service) ChangePassword(ctx context.Context, input ChangePasswordReq) error {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return err
	}

	var userID = token.Claims.UserID
	hashedPassword, err := hashPassword(input.NewPassword)
	if err != nil {
		return apierror.FromErr(err)
	}

	switch input.Role {
	case constants.ADMIN:
		var admin Admin
		if err = s.db.WithContext(ctx).Where("id = ?", userID).First(&admin).Error; err == nil {
			if !comparePassword(admin.Password, input.CurrentPassword) {
				return apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCurPassword)
			}
			admin.Password = hashedPassword
			if err = s.db.WithContext(ctx).Save(&admin).Error; err != nil {
				return err
			}
		}
	case constants.CUSTOMER:
		var customer Customer
		if err = s.db.WithContext(ctx).Where("id = ?", userID).First(&customer).Error; err == nil {
			if !comparePassword(customer.Password, input.CurrentPassword) {
				return apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCurPassword)
			}
			customer.Password = hashedPassword
			if err = s.db.WithContext(ctx).Save(&customer).Error; err != nil {
				return err
			}
		}
	}

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCurPassword)
		}
		return err
	}

	return nil
}
