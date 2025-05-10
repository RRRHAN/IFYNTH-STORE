package user

import "time"

type LoginRes struct {
	Token         string    `json:"token"`
	Expires       time.Time `json:"expires"`
	TotalQuantity int64     `json:"total_cart"`
}

type VerifyTokenRes struct {
	TokenVerified bool `json:"tokenVerified"`
}

type LogoutRes struct {
	LoggedOut bool `json:"loggedOut"`
}
