package main

import (
	"context"
	"flag"
	"log"
	"os"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/database"
	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/logger"
	"github.com/daichi1002/order-management-system/backend/internal/usecase"
	"github.com/daichi1002/order-management-system/backend/internal/util"
	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func main() {

	logger.Init(os.Getenv("ENV"))
	logger.Info("Start batch process")
	if err := godotenv.Load(); err != nil {
		logger.Fatal("Error loading .env file", zap.Error(err))
	}

	ctx := context.Background()
	targetDate := flag.String("date", "", "Target date for aggregation (format: YYYY-MM-DD)")
	flag.Parse()

	// 日付が指定されていない場合は前日を使用
	var aggregationDate time.Time
	if *targetDate == "" {
		aggregationDate = util.NowFunc().AddDate(0, 0, -1)
	} else {
		var err error
		aggregationDate, err = time.Parse("2006-01-02", *targetDate)
		if err != nil {
			logger.Fatal("Invalid date format", zap.Error(err))
		}
	}

	db, err := database.NewDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	txManager := database.NewTxManager(db)
	orderRepository := repository.NewOrderRepository(db)
	salesRepository := repository.NewSalesRepository(db)

	salesUsecase := usecase.NewSalesUsecase(txManager, salesRepository, orderRepository)
	err = salesUsecase.CreateSales(ctx, aggregationDate)

	if err != nil {
		log.Fatal("Failed batch", zap.Error(err))
	}

	logger.Info("Success batch process")
}
