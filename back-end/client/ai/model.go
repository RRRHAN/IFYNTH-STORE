package ai

type PredictImageData struct {
	Prediction string  `json:"prediction"`
	Confidence float64 `json:"confidence"`
}
