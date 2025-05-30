package address

type AddressReq struct {
	DestinationID    string `json:"destinationID"`
	Address          string `json:"address"`
	ZipCode          string `json:"zipCode"`
	DestinationLabel string `json:"destinationLabel"`
}
