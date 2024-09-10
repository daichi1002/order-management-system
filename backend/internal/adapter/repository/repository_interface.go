package repository

import (
	"context"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type MenuRepository interface {
	GetMenus() ([]model.Menu, error)
}

type OrderRepository interface {
	CreateOrder(ctx context.Context, tx *gorm.DB, order *model.Order) (int, error)
	GetOrdersWithDetails(ctx context.Context, dateTime time.Time) ([]*model.Order, error)
	DeleteOrder(ctx context.Context, tx *gorm.DB, id int) error
}

type OrderItemRepository interface {
	CreateOrderItems(ctx context.Context, tx *gorm.DB, orderItems []*model.OrderItem) error
	DeleteOrderItems(ctx context.Context, tx *gorm.DB, id int) error
}

type SalesRepository interface {
	GetMonthlySales(ctx context.Context, month string) ([]model.Sales, error)
	CreateSales(tx *gorm.DB, data model.Sales) error
	GetSalesByDate(ctx context.Context, date string) (*model.Sales, error)
}
