package config

import (
	"context"
	"time"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/logger"
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	Host        string      `envconfig:"host"`
	Port        int         `envconfig:"port" validate:"number,required"`
	Environment Environment `envconfig:"environment" validate:"oneof=DEVELOPMENT TEST STAGING PRODUCTION"`
	AIBaseUrl   string      `envconfig:"ai_base_url"`
	Version     string      `envconfig:"version" default:"development"`
	Database    Database    `envconfig:"database"`
	Logger      Logger      `envconfig:"logger"`
	Auth        Auth        `envconfig:"auth"`
	RateLimiter RateLimiter `envconfig:"rate_limiter"`
	RajaOngkir  RajaOngkir  `envconfig:"raja_ongkir"`
}

type Database struct {
	Username string `envconfig:"username"`
	Password string `envconfig:"password"`
	Host     string `envconfig:"host"`
	Port     string `envconfig:"port"`
	Name     string `envconfig:"name"`
}

type Logger struct {
	Level string `envconfig:"level" validate:"oneof=TRACE DEBUG INFO WARN ERROR FATAL PANIC"`
}

type Auth struct {
	JWT   JWT   `envconfig:"jwt" validate:"required"`
	Basic Basic `envconfig:"basic" validate:"required"`
}

type JWT struct {
	Username  string        `envconfig:"username" validate:"required"`
	Password  string        `envconfig:"password" validate:"required"`
	ExpireIn  time.Duration `envconfig:"expire_in" default:"1000m"`
	SecretKey string        `envconfig:"secret_key" validate:"required"`
}

type Basic struct {
	Username string `envconfig:"username" validate:"required"`
	Password string `envconfig:"password" validate:"required"`
}

type RateLimiter struct {
	Rps    int `envconfig:"rps" default:"10"`
	Bursts int `envconfig:"bursts" default:"5"`
}

type RajaOngkir struct {
	BaseUrl string `envconfig:"base_url"`
	ApiKey  string `envconfig:"api_key"`
}

var config *Config

func NewConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		logger.Trace(context.Background(), "Failed to load .env : %v", err)
	}

	var c Config
	err = envconfig.Process("backend", &c)
	if err != nil {
		panic("Failed to Process env : " + err.Error())
	}

	config = &c

	return config
}

func GetConfig() *Config {
	if config != nil {
		return config
	}
	return NewConfig()
}
