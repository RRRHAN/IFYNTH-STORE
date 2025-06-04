package address

type AddressReq struct {
	DestinationID    string `json:"destinationID"`
	RecipientsName   string `json:"RecipientsName"`
	RecipientsNumber string `json:"RecipientsNumber"`
	Address          string `json:"address"`
	ZipCode          string `json:"zipCode"`
	DestinationLabel string `json:"destinationLabel"`
}
