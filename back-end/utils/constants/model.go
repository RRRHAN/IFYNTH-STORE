package constants

import (
	"net/url"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

type JWTClaims struct {
	UserID   uuid.UUID `json:"userID"`
	Username string    `json:"username"`
	Role     ROLE      `json:"role"`
	jwt.RegisteredClaims
}

type Token struct {
	Token  string
	Claims JWTClaims
}

type FilterReq struct {
	Limit          int64 `validate:"gte=1"`
	Page           int64 `validate:"gte=1"`
	OrderBy        string
	Keyword        string
	SortOrder      string `validate:"oneof=asc desc"`
	StartCreatedAt *time.Time
	EndCreatedAt   *time.Time
	StartUpdatedAt *time.Time
	EndUpdatedAt   *time.Time
}

type MetaData struct {
	Page      int64 `json:"page"`
	TotalPage int64 `json:"totalPage"`
	TotalData int64 `json:"totalData"`
}

type Pagination[T any] struct {
	Data       T        `json:"data"`
	Pagination MetaData `json:"pagination"`
}

type RequestPayload struct {
	Body        map[string]any      `json:"body" bson:"body"`
	QueryParams url.Values          `json:"queryParams" bson:"queryParams"`
	Headers     map[string][]string `json:"headers" bson:"headers"`
}

type ROLE string

func (r ROLE) String() string {
	return string(r)
}

const (
	ADMIN    ROLE = "ADMIN"
	CUSTOMER ROLE = "CUSTOMER"
)
