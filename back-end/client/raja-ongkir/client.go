package rajaongkir

import (
	"errors"

	"github.com/go-resty/resty/v2"
)

type OngkirClient interface {
	SearchDestination(keyword string) (*DefaultResponse[Destination], error)
	GetShippingCost(input GetShippingCostReq) (*DefaultResponse[ShippingOption], error)
}

type ongkirClient struct {
	resty *resty.Client
}

func NewOngkirClient(apiKey string, baseURL string) OngkirClient {
	client := resty.New().
		SetBaseURL(baseURL).
		SetHeader("x-api-key", apiKey)

	return &ongkirClient{
		resty: client,
	}
}

func (c *ongkirClient) SearchDestination(keyword string) (*DefaultResponse[Destination], error) {
	if len(keyword) < 3 {
		return nil, errors.New("keyword must be at least 3 characters")
	}

	var res DefaultResponse[Destination]
	_, err := c.resty.R().
		SetQueryParam("keyword", keyword).
		SetResult(&res).
		Get("/destination/search")

	if err != nil {
		return nil, err
	}

	return &res, nil
}

func (c *ongkirClient) GetShippingCost(input GetShippingCostReq) (*DefaultResponse[ShippingOption], error) {
	var res DefaultResponse[ShippingOption]
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
