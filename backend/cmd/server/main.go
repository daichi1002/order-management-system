package main

import (
	"log"
	"net/http"
	"os"

	"github.com/daichi1002/order-management-system/backend/internal/di"
	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/database"
	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/logger"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4/middleware"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	logger.Init(os.Getenv("ENV"))

	db, err := database.NewDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	server, err := di.InitializeServer(db)
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	server.Use(middleware.Logger())

	// CORSミドルウェアを設定
	server.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{os.Getenv("CORS_URL")}, // 許可するオリジンを指定
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
	}))

	if err := server.Start(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
