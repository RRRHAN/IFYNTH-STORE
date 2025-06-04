package routes

import (
	"context"
	"database/sql"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/logger"
)

type Dependency struct {
	handler *gin.Engine
	db      *gorm.DB
}

func (d *Dependency) Close() {
	ctx := context.Background()

	if err := d.GetDB().Close(); err != nil {
		logger.Error(ctx, "Errror closing database: %v", err)
	}

}

func (d *Dependency) GetHandler() *gin.Engine {
	return d.handler
}

func (d *Dependency) GetDB() *sql.DB {
	ctx := context.Background()
	db, err := d.db.DB()
	if err != nil {
		logger.Error(ctx, "Errror get database: %v", err)
	}
	return db
}
