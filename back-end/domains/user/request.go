package user

import "time"

type LoginReq struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
	Role     ROLE   `json:"role" validate:"required,oneof=ADMIN CUSTOMER"`
}

type LogoutReq struct {
	Token   string
	Expires time.Time
}

type RegisterReq struct {
	Name        string `json:"name" validate:"required"`
	Username    string `json:"username" validate:"required"`
	Password    string `json:"password" validate:"required"`
	PhoneNumber string `json:"phoneNumber" validate:"required"`
}
