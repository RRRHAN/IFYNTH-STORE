package database

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/RRRHAN/IFYNTH-STORE/back-end/utils/config"
)

func NewDB(conf *config.Config) (gormDb *gorm.DB, err error) {

	connStr := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		conf.Database.Username,
		conf.Database.Password,
		conf.Database.Host,
		conf.Database.Port,
		conf.Database.Name,
	)

	var (
		gormDB *gorm.DB
	)

	for i := 0; i < 10; i++ {
		gormDB, err = getGormDB(connStr)
		if err == nil {
			break
		}

		log.Print("Database not ready yet, retrying in 5 seconds...")
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return nil, err
	}

	return gormDB, nil
}

func getGormDB(connStr string) (gormDB *gorm.DB, err error) {
	gormDB, err = gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	db, err := gormDB.DB()
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return gormDB, nil
}
