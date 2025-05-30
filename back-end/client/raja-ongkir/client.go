package rajaongkir

import (
	"errors"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/go-resty/resty/v2"
)

type Client interface {
	SearchDestination(keyword string) (*DefaultResponse[[]Destination], error)
	GetShippingCost(input GetShippingCostReq) (*DefaultResponse[[]ShippingCost], error)
}

type client struct {
	resty *resty.Client
}

func NewRajaOngkirClient(conf *config.Config) Client {
	rajaOngkirConf := conf.RajaOngkir
	c := resty.New().
		SetBaseURL(rajaOngkirConf.BaseUrl).
		SetHeader("x-api-key", rajaOngkirConf.ApiKey)

	return &client{
		resty: c,
	}
}

func (c *client) SearchDestination(keyword string) (*DefaultResponse[[]Destination], error) {
	if len(keyword) < 3 {
		return nil, errors.New("keyword must be at least 3 characters")
	}

	var res DefaultResponse[[]Destination]
	_, err := c.resty.R().
		SetQueryParam("keyword", keyword).
		SetResult(&res).
		Get("/destination/search")

	if err != nil {
		return nil, err
	}

	return &res, nil
}

func (c *client) GetShippingCost(input GetShippingCostReq) (*DefaultResponse[[]ShippingCost], error) {
	var res DefaultResponse[[]ShippingCost]
	_, err := c.resty.R().
		SetQueryParams(map[string]string{
			"shipper_destination_id":  "30711",
			"receiver_destination_id": input.ReceiverID,
			"weight":                  input.Weight,
			"item_value":              input.ItemValue,
			"cod":                     "no",
		}).
		SetResult(&res).
		Get("/calculate")

	if err != nil {
		return nil, err
	}

	return &res, nil
}
