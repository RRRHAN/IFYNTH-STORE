package routes

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cart"
	imageclassifier "github.com/RRRHAN/IFYNTH-STORE/back-end/domains/image-classifier"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
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
	}

	product := router.Group("/product")
	{
		product.GET("/", mw.JWT(constants.ADMIN, constants.CUSTOMER), productHandler.GetAllProducts)
		product.GET("/detail/:id", mw.JWT(constants.ADMIN, constants.CUSTOMER), productHandler.GetProductByID)
		product.POST("/", mw.JWT(constants.ADMIN), productHandler.AddProduct)
		product.DELETE("/:id", mw.JWT(constants.ADMIN), productHandler.DeleteProduct)

	}

	cart := router.Group("/cart")
	{
		cart.POST("/", mw.JWT(constants.CUSTOMER), cartHandler.AddToCart)
		cart.PUT("/update", mw.JWT(constants.CUSTOMER), cartHandler.UpdateCartQuantity)
		cart.DELETE("/delete", mw.JWT(constants.CUSTOMER), cartHandler.DeleteFromCart)
		cart.GET("/:user_id", mw.JWT(constants.CUSTOMER), cartHandler.GetCartByUserID)

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
