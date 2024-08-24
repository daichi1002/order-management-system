package handler

import (
	"net/http"

	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/logger"
	"github.com/daichi1002/order-management-system/backend/internal/usecase"
	"go.uber.org/zap"

	"github.com/labstack/echo/v4"
)

type MenuHandler struct {
	usecase usecase.MenuUsecase
}

func NewMenuHandler(u usecase.MenuUsecase) *MenuHandler {
	return &MenuHandler{u}
}

func (h *MenuHandler) GetAllMenus(c echo.Context) error {
	menus, err := h.usecase.Handle()
	if err != nil {
		logger.Error("Failed get user", zap.Error(err))
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, menus)
}
