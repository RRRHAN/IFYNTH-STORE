package ongkir

import "github.com/google/uuid"

type GetShippingCostReq struct {
	AddressId uuid.UUID `json:"addressId"`
	Weight    string    `json:"weight"`
	ItemValue string    `json:"itemValue"`
}
