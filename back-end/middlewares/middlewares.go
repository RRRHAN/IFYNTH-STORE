package middlewares

import (
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"net/http"
	"slices"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"golang.org/x/time/rate"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/domains/user"
	apierror "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/api-error"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/constants"
	contextUtil "github.com/RRRHAN/IFYNTH-STORE/back-end/utils/context"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/logger"
	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/respond"
)

type Middlewares interface {
	AddRequestId(ctx *gin.Context)
	Logging(ctx *gin.Context)
	BasicAuth(ctx *gin.Context)
	JWT(roles ...constants.ROLE) func(ctx *gin.Context)
	Recover(ctx *gin.Context)
	RateLimiter(ctx *gin.Context)
}

type middlewares struct {
	conf        *config.Config
	rateLimiter *rate.Limiter
	userService user.Service
}

// Constructor untuk middlewares
func NewMiddlewares(conf *config.Config, userService user.Service) Middlewares {
	return &middlewares{
		conf:        conf,
		rateLimiter: rate.NewLimiter(rate.Limit(conf.RateLimiter.Rps), conf.RateLimiter.Bursts),
		userService: userService,
	}
}

func (m *middlewares) AddRequestId(ctx *gin.Context) {
	requestId := uuid.New()
	ctx = contextUtil.GinWithCtx(ctx, contextUtil.SetRequestId(ctx, requestId))
	ctx.Header("Request-Id", requestId.String())
	ctx.Next()
}

func (m *middlewares) Logging(ctx *gin.Context) {
	start := time.Now()
	reqPayload := getRequestPayload(ctx)

	ctx.Next()

	logPayload := logger.LogPayload{
		Method:         ctx.Request.Method,
		Path:           ctx.Request.URL.Path,
		StatusCode:     ctx.Writer.Status(),
		Took:           time.Since(start),
		RequestPayload: reqPayload,
	}

	var err error
	errAny, ok := ctx.Get("error")
	if !ok {
		err = nil
	} else {
		err, ok = errAny.(error)
		if !ok {
			err = nil
		}
	}

	logger.Log(ctx, logPayload, err)
}

func (m *middlewares) BasicAuth(ctx *gin.Context) {
	username, password, ok := ctx.Request.BasicAuth()
	if ok {
		usernameHash := sha256.Sum256([]byte(username))
		passwordHash := sha256.Sum256([]byte(password))
		expectedUsernameHash := sha256.Sum256([]byte(m.conf.Auth.Basic.Username))
		expectedPasswordHash := sha256.Sum256([]byte(m.conf.Auth.Basic.Password))
		usernameMatch := (subtle.ConstantTimeCompare(usernameHash[:], expectedUsernameHash[:]) == 1)
		passwordMatch := (subtle.ConstantTimeCompare(passwordHash[:], expectedPasswordHash[:]) == 1)
		if usernameMatch && passwordMatch {
			ctx.Next()
			return
		}
	}
	respond.Error(ctx, apierror.Unauthorized())
}

func (m *middlewares) JWT(roles ...constants.ROLE) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		authorization := ctx.Request.Header.Get(constants.AUTHORIZATION)
		if authorization == "" {
			authorization = ctx.Request.Header.Get(constants.AUTH)
		}
		authorizationSplit := strings.Split(authorization, " ")
		if len(authorizationSplit) < 2 {
			respond.Error(ctx, apierror.Unauthorized())
			return
		}
		claims := constants.JWTClaims{}
		tokenStr := authorizationSplit[1]
		token, err := jwt.ParseWithClaims(tokenStr, &claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(m.conf.Auth.JWT.SecretKey), nil
		})
		if err != nil || !token.Valid {
			respond.Error(ctx, apierror.Unauthorized())
			return
		}

		err = m.userService.ValidateToken(ctx, tokenStr)
		if err != nil {
			respond.Error(ctx, apierror.Unauthorized())
			return
		}

		if !slices.Contains(roles, claims.Role) {
			respond.Error(ctx, apierror.Unauthorized())
			return
		}

		// Set token claims di context
		ctx = contextUtil.GinWithCtx(ctx, contextUtil.SetTokenClaims(ctx, constants.Token{
			Token:  tokenStr,
			Claims: claims,
		}))

		ctx.Next()
	}

}

func (m *middlewares) Recover(ctx *gin.Context) {
	defer func() {
		if r := recover(); r != nil {
			respond.Error(ctx, apierror.NewError(http.StatusInternalServerError, fmt.Sprintf("Panic : %v", r)))
		}
	}()
	ctx.Next()
}

func (m *middlewares) RateLimiter(ctx *gin.Context) {
	if !m.rateLimiter.Allow() {
		respond.Error(ctx, apierror.NewWarn(http.StatusTooManyRequests, "Too many request"))
		return
	}
	ctx.Next()
}
