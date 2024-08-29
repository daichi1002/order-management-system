package repository

import (
	"context"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type MenuRepository interface {
	GetMenus() ([]model.Menu, error)
}

type OrderRepository interface {
	CreateOrder(ctx context.Context, tx *gorm.DB, order *model.Order) (int, error)
	GetTodayOrdersWithDetails(ctx context.Context) ([]*model.Order, error)
}

type OrderItemRepository interface {
	CreateOrderItems(ctx context.Context, tx *gorm.DB, orderItems []*model.OrderItem) error
}
