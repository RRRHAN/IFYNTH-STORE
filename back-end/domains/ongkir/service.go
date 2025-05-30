package ongkir

import (
	"context"

	"gorm.io/gorm"

	rajaongkir "github.com/RRRHAN/IFYNTH-STORE/back-end/client/raja-ongkir"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/address"
)

type Service interface {
	GetDestination(ctx context.Context, keyword string) (res []rajaongkir.Destination, err error)
	GetShippingCost(ctx context.Context, input GetShippingCostReq) (res []rajaongkir.ShippingCost, err error)
}

type service struct {
	rajaOngkir rajaongkir.Client
	db         *gorm.DB
}

func NewService(rajaOngkir rajaongkir.Client, db *gorm.DB) Service {
	return &service{
		rajaOngkir: rajaOngkir,
		db:         db,
	}
}

func (s *service) GetDestination(ctx context.Context, keyword string) (res []rajaongkir.Destination, err error) {
	dest, err := s.rajaOngkir.SearchDestination(keyword)
	if err != nil {
		return nil, err
	}
	return dest.Data, nil
}

func (s *service) GetShippingCost(ctx context.Context, input GetShippingCostReq) (res []rajaongkir.ShippingCost, err error) {

	var address address.CustomerAddress
	err = s.db.First(&address, input.AddressId).Error
	if err != nil {
		return nil, err
	}

	cost, err := s.rajaOngkir.GetShippingCost(rajaongkir.GetShippingCostReq{
		ReceiverID: address.DestinationID,
		Weight:     input.Weight,
		ItemValue:  input.ItemValue,
	})
	if err != nil {
		return nil, err
	}

	return cost.Data, nil
}
