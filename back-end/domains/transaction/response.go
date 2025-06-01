package transaction

import "time"

type StatusCount struct {
	Status string
	Count  int64
}

type Result struct {
	Date        time.Time
	TotalAmount float64
}

type ResultByCustomer struct {
	UserID           string  `json:"userID"`
	CustomerName     string  `json:"CustomerName"`
	PhoneNumber      string  `json:"PhoneNumber"`
	TotalAmount      float64 `json:"TotalAmount"`
	TransactionCount int64   `json:"TotalTransaction"`
}
