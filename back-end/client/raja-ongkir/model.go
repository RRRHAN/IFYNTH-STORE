package rajaongkir

type DefaultResponse[T any] struct {
	Meta Meta `json:"meta"`
	Data T    `json:"data"`
}

type Meta struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
	Status  string `json:"status"`
}

type Destination struct {
	ID          int    `json:"id"`
	Label       string `json:"label"`
	Subdistrict string `json:"subdistrict_name"`
	District    string `json:"district_name"`
	City        string `json:"city_name"`
	Province    string `json:"province_name"`
	ZipCode     string `json:"zip_code"`
}

type ShippingCost struct {
	ShippingName     string  `json:"shipping_name"`
	ServiceName      string  `json:"service_name"`
	Weight           float64 `json:"weight"`
	IsCOD            bool    `json:"is_cod"`
	ShippingCost     int     `json:"shipping_cost"`
	ShippingCashback int     `json:"shipping_cashback"`
	ShippingCostNet  int     `json:"shipping_cost_net"`
	GrandTotal       int     `json:"grandtotal"`
	ServiceFee       int     `json:"service_fee"`
	NetIncome        int     `json:"net_income"`
	ETD              string  `json:"etd"`
}

type ShippingCostResponse struct {
	CalculateReguler []ShippingCost `json:"calculate_reguler"`
	CalculateCargo   []ShippingCost `json:"calculate_cargo"`
	CalculateInstant []ShippingCost `json:"calculate_instant"`
}

type GetShippingCostReq struct {
	ReceiverID string
	Weight     string
	ItemValue  string
}
