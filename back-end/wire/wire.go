//go:build wireinject
// +build wireinject

package wireinject

import (
	"github.com/go-playground/validator/v10"
	_ "github.com/google/subcommands"
	"github.com/google/wire"

	rajaongkir "github.com/RRRHAN/IFYNTH-STORE/back-end/client/raja-ongkir"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/database"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/address"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cart"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cusproduct"
	imageclassifier "github.com/RRRHAN/IFYNTH-STORE/back-end/domains/image-classifier"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/message"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/ongkir"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/transaction"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/user"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/middlewares"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/routes"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
)

var userSet = wire.NewSet(
	user.NewService,
	user.NewHandler,
)

var productSet = wire.NewSet(
	product.NewService,
	product.NewHandler,
)

var cartSet = wire.NewSet(
	cart.NewService,
	cart.NewHandler,
)

var imageClassifierSet = wire.NewSet(
	imageclassifier.NewPredictor,
	imageclassifier.NewService,
	imageclassifier.NewHandler,
)

var cusproductSet = wire.NewSet(
	cusproduct.NewService,
	cusproduct.NewHandler,
)

var messageSet = wire.NewSet(
	message.NewService,
	message.NewHandler,
)

var transactionSet = wire.NewSet(
	transaction.NewService,
	transaction.NewHandler,
)

var ongkirSet = wire.NewSet(
	ongkir.NewService,
	ongkir.NewHandler,
)

var addressSet = wire.NewSet(
	address.NewService,
	address.NewHandler,
)

func initializeDependency(config *config.Config) (*routes.Dependency, error) {

	wire.Build(
		database.NewDB,
		validator.New,
		middlewares.NewMiddlewares,
		routes.NewDependency,
		userSet,
		productSet,
		cartSet,
		imageClassifierSet,
		cusproductSet,
		messageSet,
		transactionSet,
		rajaongkir.NewRajaOngkirClient,
		ongkirSet,
		addressSet,
	)

	return nil, nil
}
