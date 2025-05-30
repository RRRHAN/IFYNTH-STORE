package routes

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

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
	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/constants"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

func NewDependency(
	conf *config.Config,
	mw middlewares.Middlewares,
	db *gorm.DB,
	predictor imageclassifier.Predictor,
	userHandler user.Handler,
	productHandler product.Handler,
	cartHandler cart.Handler,
	imageClassifierHandler imageclassifier.Handler,
	cusproductHandler cusproduct.Handler,
	messageHandler message.Handler,
	transactionHandler transaction.Handler,
	addressHandler address.Handler,
	ongkirHandler ongkir.Handler,
) *Dependency {

	if conf.Environment != config.DEVELOPMENT_ENVIRONMENT {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.HandleMethodNotAllowed = true
	router.ContextWithFallback = true

	// middleware
	{
		router.Use(cors.Default())
		router.Use(mw.AddRequestId)
		router.Use(mw.Logging)
		router.Use(mw.RateLimiter)
		router.Use(mw.Recover)
	}

	api := router.Group("/api")
	api.Static("/uploads", "./uploads")
	api.GET("/health-check", HealthCheck)

	// domain user
	user := api.Group("/user")
	{
		user.POST("/login", mw.BasicAuth, userHandler.Login)
		user.GET("/verify-token", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.VerifyToken)
		user.POST("/logout", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.Logout)
		user.POST("/register", mw.BasicAuth, userHandler.Register)
		user.POST("/registerAdmin", mw.JWT(constants.ADMIN), userHandler.RegisterAdmin)
		user.PATCH("/updateCustomer", mw.JWT(constants.CUSTOMER), userHandler.UpdateProfile)
		user.PATCH("/password", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.ChangePassword)
		user.GET("/get-personal", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.GetPersonal)
		user.GET("/check-jwt", mw.JWT(constants.ADMIN, constants.CUSTOMER), func(ctx *gin.Context) {
			respond.Success(ctx, http.StatusOK, "JWT is valid")
		})
	}

	product := api.Group("/product")
	{
		product.GET("/", mw.JWT(constants.ADMIN, constants.CUSTOMER), productHandler.GetAllProducts)
		product.GET("/detail/:id", mw.JWT(constants.ADMIN, constants.CUSTOMER), productHandler.GetProductByID)
		product.POST("/addProduct", mw.JWT(constants.ADMIN), productHandler.AddProduct)
		product.DELETE("/:id", mw.JWT(constants.ADMIN), productHandler.DeleteProduct)
		product.PUT("/update/:id", mw.JWT(constants.ADMIN), productHandler.UpdateProduct)
		product.GET("/count", mw.JWT(constants.ADMIN), productHandler.GetProductCountByDepartment)
		product.GET("/totalCapital", mw.JWT(constants.ADMIN), productHandler.GetTotalCapital)
	}

	cart := api.Group("/cart")
	{
		cart.POST("/", mw.JWT(constants.CUSTOMER), cartHandler.AddToCart)
		cart.PUT("/", mw.JWT(constants.CUSTOMER), cartHandler.UpdateCartQuantity)
		cart.DELETE("/delete", mw.JWT(constants.CUSTOMER), cartHandler.DeleteFromCart)
		cart.GET("/", mw.JWT(constants.CUSTOMER), cartHandler.GetCartByUserID)

	}

	imageClassifier := api.Group("/image-classifier")
	{
		imageClassifier.POST("/predict", mw.JWT(constants.ADMIN, constants.CUSTOMER), imageClassifierHandler.Predict)

	}

	cusproduct := api.Group("/cusproduct")
	{
		cusproduct.POST("/", mw.JWT(constants.CUSTOMER), cusproductHandler.AddProduct)
		cusproduct.DELETE("/", mw.JWT(constants.CUSTOMER), cusproductHandler.DeleteProduct)
		cusproduct.GET("/", mw.JWT(constants.CUSTOMER), cusproductHandler.GetProductByUserID)
		cusproduct.GET("/list", mw.JWT(constants.CUSTOMER), cusproductHandler.GetProductByMessage)
		cusproduct.GET("/getall", mw.JWT(constants.ADMIN), cusproductHandler.GetAllProducts)
		cusproduct.PATCH("/status", mw.JWT(constants.ADMIN), cusproductHandler.UpdateProductStatus)

	}

	message := api.Group("/message")
	{
		message.POST("/", mw.JWT(constants.CUSTOMER, constants.ADMIN), messageHandler.AddMessage)
		message.GET("/:product_id", mw.JWT(constants.CUSTOMER, constants.ADMIN), messageHandler.GetMessageByProductID)
	}

	transaction := api.Group("/transaction")
	{
		transaction.POST("/", mw.JWT(constants.CUSTOMER), transactionHandler.AddTransaction)
		transaction.GET("/", mw.JWT(constants.CUSTOMER), transactionHandler.GetTransactionsByUserID)
		transaction.GET("/all", mw.JWT(constants.ADMIN), transactionHandler.GetAllTransaction)
		transaction.PATCH("/status", mw.JWT(constants.ADMIN), transactionHandler.UpdateTransactionStatus)
		transaction.GET("/count", mw.JWT(constants.ADMIN), transactionHandler.GetTransactionCountByStatus)
		transaction.GET("/report", mw.JWT(constants.ADMIN), transactionHandler.GetTotalAmountByDate)
		transaction.GET("/totalIncome", mw.JWT(constants.ADMIN), transactionHandler.GetTotalIncome)
		transaction.GET("/totalTransactionUser", mw.JWT(constants.ADMIN), transactionHandler.GetTotalTransactionByCustomer)
		transaction.POST("/pay", mw.JWT(constants.ADMIN), transactionHandler.PayTransaction)
	}

	address := api.Group("/address")
	{
		address.POST("/", mw.JWT(constants.CUSTOMER), addressHandler.InsertAddress)
		address.GET("/", mw.JWT(constants.CUSTOMER), addressHandler.GetAdderess)
		address.PUT("/:id", mw.JWT(constants.CUSTOMER), addressHandler.UpdateAddress)
		address.PUT("/:id", mw.JWT(constants.CUSTOMER), addressHandler.DeleteAddress)
	}

	ongkir := api.Group("/ongkir")
	{
		ongkir.GET("/destination/:keyword", mw.JWT(constants.CUSTOMER), ongkirHandler.GetDestination)
		ongkir.GET("/cost", mw.JWT(constants.CUSTOMER), ongkirHandler.GetShippingCost)
	}

	router.NoRoute(func(ctx *gin.Context) {
		respond.Error(ctx, apierror.NewWarn(http.StatusNotFound, "Page not found"))
	})

	router.NoMethod(func(ctx *gin.Context) {
		respond.Error(ctx, apierror.NewWarn(http.StatusMethodNotAllowed, "Method not allowed"))
	})

	return &Dependency{
		handler:   router,
		db:        db,
		predictor: predictor,
	}
}

func HealthCheck(ctx *gin.Context) {
	respond.Success(ctx, http.StatusOK, "server running properly")
}
