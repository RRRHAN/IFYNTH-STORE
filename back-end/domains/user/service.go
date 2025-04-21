package user

import (
	"context"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"gorm.io/gorm"

	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/constants"
)

type Service interface {
	Login(ctx context.Context, input LoginReq) (res *LoginRes, err error)
	Logout(ctx context.Context, input LogoutReq) (res *LogoutRes, err error)
	ValidateToken(ctx context.Context, token string) (err error)
	Register(ctx context.Context, input RegisterReq) (res *Customer, err error)
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

func (s *service) Login(ctx context.Context, input LoginReq) (*LoginRes, error) {

	switch input.Role {
	case ADMIN:
		var admin Admin
		if err := s.db.WithContext(ctx).Where("username = ?", input.Username).First(&admin).Error; err == nil {
			if !comparePassword(admin.Password, input.Password) {
				return nil, apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCredentials)
			}
		}
	case CUSTOMER:
		var customer Customer
		if err := s.db.WithContext(ctx).Where("username = ?", input.Username).First(&customer).Error; err == nil {
			if !comparePassword(customer.Password, input.Password) {
				return nil, apierror.NewWarn(http.StatusUnauthorized, ErrInvalidCredentials)
			}
		}
	}

	expirationTime := time.Now().Add(s.authConfig.JWT.ExpireIn)
	claims := &constants.JWTClaims{
		Username: input.Username,
		Role:     input.Role.String(),
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.authConfig.JWT.SecretKey))
	if err != nil {
		return nil, apierror.FromErr(err)
	}

	return &LoginRes{
		Token:   tokenString,
		Expires: expirationTime,
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
