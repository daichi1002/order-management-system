package resolver

import (
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/database"
	"github.com/daichi1002/order-management-system/backend/internal/usecase"
	"gorm.io/gorm"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	menuUsecase  usecase.MenuUsecase
	orderUsecase usecase.OrderUsecase
}

func NewResolver(db *gorm.DB) *Resolver {
	txManager := database.NewTxManager(db)

	menuRepository := repository.NewMenuRepository(db)
	orderRepository := repository.NewOrderRepository(db)
	orderItemRepository := repository.NewOrderItemRepository(db)

	menuUsecase := usecase.NewMenuUsecase(menuRepository)
	orderUsecase := usecase.NewOrderUsecase(txManager, orderRepository, orderItemRepository)

	return &Resolver{
		menuUsecase:  menuUsecase,
		orderUsecase: orderUsecase,
	}
}
