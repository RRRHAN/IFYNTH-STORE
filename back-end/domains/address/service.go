package address

import (
	"context"

	"gorm.io/gorm"

	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
	"github.com/google/uuid"
)

type Service interface {
	GetAdderess(ctx context.Context) (res []CustomerAddress, err error)
	InsertAddress(ctx context.Context, input AddressReq) (res *CustomerAddress, err error)
	UpdateAddress(ctx context.Context, addressId uuid.UUID, input AddressReq) (res *CustomerAddress, err error)
	DeleteAddress(ctx context.Context, addressId uuid.UUID) (err error)
}

type service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) Service {
	return &service{
		db: db,
	}
}

func (s *service) GetAdderess(ctx context.Context) (res []CustomerAddress, err error) {
	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, err
	}

	err = s.db.Where("user_id = ?", token.Claims.UserID).Find(&res).Error
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *service) InsertAddress(ctx context.Context, input AddressReq) (res *CustomerAddress, err error) {

	token, err := contextUtil.GetTokenClaims(ctx)
	if err != nil {
		return nil, err
	}

	res = &CustomerAddress{
		UserID:           token.Claims.UserID,
		DestinationID:    input.DestinationID,
		Address:          input.Address,
		ZipCode:          input.ZipCode,
		DestinationLabel: input.DestinationLabel,
	}

	err = s.db.Create(res).Error
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *service) UpdateAddress(ctx context.Context, addressId uuid.UUID, input AddressReq) (res *CustomerAddress, err error) {
	err = s.db.First(res, addressId).Error
	if err != nil {
		return nil, err
	}

	res.DestinationID = input.DestinationID
	res.Address = input.Address
	res.ZipCode = input.ZipCode
	res.DestinationLabel = input.DestinationLabel

	err = s.db.Save(res).Error
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (s *service) DeleteAddress(ctx context.Context, addressId uuid.UUID) (err error) {
	return s.db.Where("id = ?", addressId).Delete(&CustomerAddress{}).Error
}
