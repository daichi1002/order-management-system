package usecase

import (
	"context"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
)

type MenuUsecase interface {
	Handle(ctx context.Context) ([]model.Menu, error)
}

type OrderUsecase interface {
	Handle(ctx context.Context, order *model.Order, orderItems []*model.OrderItem) (int, error)
}
