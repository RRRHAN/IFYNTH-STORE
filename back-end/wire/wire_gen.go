// Code generated by Wire. DO NOT EDIT.

//go:generate go run github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package wireinject

import (
	"github.com/RRRHAN/IFYNTH-STORE/back-end/client/ai"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/client/raja-ongkir"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/database"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/address"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cart"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cusproduct"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/message"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/ongkir"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/transaction"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/user"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/middlewares"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/routes"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/go-playground/validator/v10"
	"github.com/google/wire"
)

import (
	_ "github.com/google/subcommands"
)

// Injectors from wire.go:

func initializeDependency(config2 *config.Config) (*routes.Dependency, error) {
	db, err := database.NewDB(config2)
	if err != nil {
		return nil, err
	}
	service := user.NewService(config2, db)
	middlewaresMiddlewares := middlewares.NewMiddlewares(config2, service)
	validate := validator.New()
	handler := user.NewHandler(service, validate)
	client := ai.NewClient(config2)
	productService := product.NewService(db, client)
	productHandler := product.NewHandler(productService, validate)
	cartService := cart.NewService(config2, db)
	cartHandler := cart.NewHandler(cartService, validate)
	cusproductService := cusproduct.NewService(config2, db)
	cusproductHandler := cusproduct.NewHandler(cusproductService, validate)
	messageService := message.NewService(config2, db)
	messageHandler := message.NewHandler(messageService, validate)
	rajaongkirClient := rajaongkir.NewRajaOngkirClient(config2)
	transactionService := transaction.NewService(config2, db, rajaongkirClient)
	transactionHandler := transaction.NewHandler(transactionService, validate)
	addressService := address.NewService(db)
	addressHandler := address.NewHandler(addressService, validate)
	ongkirService := ongkir.NewService(rajaongkirClient, db)
	ongkirHandler := ongkir.NewHandler(ongkirService, validate)
	dependency := routes.NewDependency(config2, middlewaresMiddlewares, db, handler, productHandler, cartHandler, cusproductHandler, messageHandler, transactionHandler, addressHandler, ongkirHandler)
	return dependency, nil
}

// wire.go:

var userSet = wire.NewSet(user.NewService, user.NewHandler)

var productSet = wire.NewSet(product.NewService, product.NewHandler)

var cartSet = wire.NewSet(cart.NewService, cart.NewHandler)

var cusproductSet = wire.NewSet(cusproduct.NewService, cusproduct.NewHandler)

var messageSet = wire.NewSet(message.NewService, message.NewHandler)

var transactionSet = wire.NewSet(transaction.NewService, transaction.NewHandler)

var ongkirSet = wire.NewSet(ongkir.NewService, ongkir.NewHandler)

var addressSet = wire.NewSet(address.NewService, address.NewHandler)
