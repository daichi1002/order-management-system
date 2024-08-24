//go:build wireinject
// +build wireinject

package di

import (
	"github.com/daichi1002/order-management-system/backend/internal/adapter/handler"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/usecase"
	"github.com/google/wire"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

func InitializeServer(db *gorm.DB) (*echo.Echo, error) {
	wire.Build(
		repository.NewMenuRepository,
		usecase.NewMenuUsecase,
		handler.NewMenuHandler,
		newServer,
	)
	return nil, nil
}

func newServer(menuHandler *handler.MenuHandler) *echo.Echo {
	e := echo.New()

	e.GET("/menus", menuHandler.GetAllMenus)
	return e
}
