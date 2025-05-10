package routes

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cart"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cusproduct"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/message"
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
	userHandler user.Handler,
	productHandler product.Handler,
	cartHandler cart.Handler,
	cusproductHandler cusproduct.Handler,
	messageHandler message.Handler,
	transactionHandler transaction.Handler,
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

	router.Static("/uploads", "./uploads")

	// domain user
	user := router.Group("/user")
	{
		user.POST("/login", mw.BasicAuth, userHandler.Login)
		user.GET("/verify-token", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.VerifyToken)
		user.POST("/logout", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.Logout)
		user.POST("/register", mw.BasicAuth, userHandler.Register)
		user.PATCH("/password", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.ChangePassword)
		user.GET("/get-personal", mw.JWT(constants.ADMIN, constants.CUSTOMER), userHandler.GetPersonal)
	}

	product := router.Group("/product")
	{
		product.GET("/", mw.JWT(constants.ADMIN, constants.CUSTOMER), productHandler.GetAllProducts)
		product.GET("/detail/:id", mw.JWT(constants.ADMIN, constants.CUSTOMER), productHandler.GetProductByID)
		product.POST("/addProduct", mw.JWT(constants.ADMIN), productHandler.AddProduct)
		product.DELETE("/:id", mw.JWT(constants.ADMIN), productHandler.DeleteProduct)
		product.PUT("/update/:id", mw.JWT(constants.ADMIN), productHandler.UpdateProduct)
		product.GET("/count", mw.JWT(constants.ADMIN), productHandler.GetProductCountByDepartment)
	}

	cart := router.Group("/cart")
	{
		cart.POST("/", mw.JWT(constants.CUSTOMER), cartHandler.AddToCart)
		cart.PUT("/", mw.JWT(constants.CUSTOMER), cartHandler.UpdateCartQuantity)
		cart.DELETE("/delete", mw.JWT(constants.CUSTOMER), cartHandler.DeleteFromCart)
		cart.GET("/", mw.JWT(constants.CUSTOMER), cartHandler.GetCartByUserID)

	}

	cusproduct := router.Group("/cusproduct")
	{
		cusproduct.POST("/", mw.JWT(constants.CUSTOMER), cusproductHandler.AddProduct)
		cusproduct.DELETE("/", mw.JWT(constants.CUSTOMER), cusproductHandler.DeleteProduct)
		cusproduct.GET("/", mw.JWT(constants.CUSTOMER), cusproductHandler.GetProductByUserID)
		cusproduct.GET("/list", mw.JWT(constants.CUSTOMER), cusproductHandler.GetProductByMessage)
		cusproduct.GET("/getall", mw.JWT(constants.ADMIN), cusproductHandler.GetAllProducts)
		cusproduct.PATCH("/status", mw.JWT(constants.ADMIN), cusproductHandler.UpdateProductStatus)

	}

	message := router.Group("/message")
	{
		message.POST("/", mw.JWT(constants.CUSTOMER, constants.ADMIN), messageHandler.AddMessage)
		message.GET("/:product_id", mw.JWT(constants.CUSTOMER, constants.ADMIN), messageHandler.GetMessageByProductID)
	}

	transaction := router.Group("/transaction")
	{
		transaction.POST("/", mw.JWT(constants.CUSTOMER), transactionHandler.AddTransaction)
		transaction.GET("/", mw.JWT(constants.CUSTOMER), transactionHandler.GetTransactionsByUserID)
		transaction.GET("/all", mw.JWT(constants.ADMIN), transactionHandler.GetAllTransaction)
		transaction.PATCH("/status", mw.JWT(constants.ADMIN), transactionHandler.UpdateTransactionStatus)
	}

	router.NoRoute(func(ctx *gin.Context) {
		respond.Error(ctx, apierror.NewWarn(http.StatusNotFound, "Page not found"))
	})

	router.NoMethod(func(ctx *gin.Context) {
		respond.Error(ctx, apierror.NewWarn(http.StatusMethodNotAllowed, "Method not allowed"))
	})

	return &Dependency{
		handler: router,
		db:      db,
	}
}

func HealthCheck(ctx *gin.Context) {
	respond.Success(ctx, http.StatusOK, "server running properly")
}
