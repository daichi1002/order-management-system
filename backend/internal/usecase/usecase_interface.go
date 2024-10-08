package usecase

import (
	"context"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/graph/generated"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type MenuUsecase interface {
	GetMenus(ctx context.Context) ([]model.Menu, error)
}

type OrderUsecase interface {
	CreateOrder(ctx context.Context, order *model.Order, orderItems []*model.OrderItem) (int, error)
	GetOrders(ctx context.Context, dateTime time.Time) ([]*generated.Order, error)
	CancelOrder(ctx context.Context, id int, dateTime time.Time) error
}

type SalesUsecase interface {
	GetMonthlySalesData(ctx context.Context, month string) (*generated.MonthlySalesData, error)
	CreateSales(ctx context.Context, date time.Time) error
}

type CounterUsecase interface {
	GetNextNumber(tx *gorm.DB) (int, error)
}
