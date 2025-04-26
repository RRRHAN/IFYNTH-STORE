package routes

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/cart"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/product"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/user"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/middlewares"
	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

func NewDependency(
	conf *config.Config,
	mw middlewares.Middlewares,
	db *gorm.DB,
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
		user.GET("/verify-token", mw.JWT, userHandler.VerifyToken)
		user.POST("/logout", mw.JWT, userHandler.Logout)
		user.POST("/register", mw.BasicAuth, userHandler.Register)
	}

	product := router.Group("/product")
	{
		product.GET("/", mw.JWT, productHandler.GetAllProducts)
		product.GET("/detail/:id", mw.JWT, productHandler.GetProductByID)
		product.POST("/", mw.JWT, mw.RoleMiddleware("ADMIN"), productHandler.AddProduct)
		product.DELETE("/:id", mw.JWT, mw.RoleMiddleware("ADMIN"), productHandler.DeleteProduct)

	}

	cart := router.Group("/cart")
	{
		cart.POST("/", mw.JWT, cartHandler.AddToCart)
		cart.PUT("/update", cartHandler.UpdateCartQuantity)
		cart.DELETE("/delete", cartHandler.DeleteFromCart)
		cart.GET("/:user_id", cartHandler.GetCartByUserID)

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
