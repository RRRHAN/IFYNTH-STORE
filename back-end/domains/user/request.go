package user

import (
	"time"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/constants"
)

type LoginReq struct {
	Username string         `json:"username" validate:"required"`
	Password string         `json:"password" validate:"required"`
	Role     constants.ROLE `json:"role" validate:"required,oneof=ADMIN CUSTOMER"`
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

type ChangePasswordReq struct {
	CurrentPassword string         `json:"current_password" validate:"required"`
	NewPassword     string         `json:"new_password" validate:"required"`
	Role            constants.ROLE `json:"role" validate:"required,oneof=ADMIN CUSTOMER"`
}
