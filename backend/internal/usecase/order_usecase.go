package usecase

import (
	"context"
	"strconv"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/graph/generated"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/graph/scalar"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/database"
)

type orderUsecase struct {
	txManager           database.TxManager
	orderRepository     repository.OrderRepository
	orderItemRepository repository.OrderItemRepository
}

func NewOrderUsecase(txManager database.TxManager, orderRepository repository.OrderRepository, orderItemRepository repository.OrderItemRepository) OrderUsecase {
	return &orderUsecase{txManager, orderRepository, orderItemRepository}
}

func (u *orderUsecase) CreateOrder(ctx context.Context, order *model.Order, orderItems []*model.OrderItem) (int, error) {
	tx := u.txManager.Begin()

	defer u.txManager.Rollback(tx)

	id, err := u.orderRepository.CreateOrder(ctx, tx, order)

	if err != nil {
		return 0, err
	}

	for _, item := range orderItems {
		item.OrderId = id
	}

	err = u.orderItemRepository.CreateOrderItems(ctx, tx, orderItems)
	if err != nil {
		return 0, err
	}

	u.txManager.Commit(tx)

	return id, nil
}

func (u *orderUsecase) GetOrders(ctx context.Context, dateTime time.Time) ([]*generated.Order, error) {
	orders, err := u.orderRepository.GetOrdersWithDetails(ctx, dateTime)
	if err != nil {
		return nil, err
	}

	return u.convertToResponseOrders(orders), nil
}

func (u *orderUsecase) convertToResponseOrders(dbOrders []*model.Order) []*generated.Order {
	var orders []*generated.Order
	for _, dbOrder := range dbOrders {
		orders = append(orders, &generated.Order{
			ID:           strconv.Itoa(dbOrder.Id),
			TicketNumber: dbOrder.TicketNumber,
			TotalAmount:  dbOrder.TotalAmount,
			CreatedAt:    scalar.TimeToDateTime(dbOrder.OrderDate),
			Items:        u.convertToResponseOrderItems(dbOrder.Items),
		})
	}

	return orders
}

func (u *orderUsecase) convertToResponseOrderItems(dbItems []model.OrderItem) []*generated.OrderItem {
	items := make([]*generated.OrderItem, len(dbItems))
	for i, item := range dbItems {
		items[i] = &generated.OrderItem{
			Quantity: item.Quantity,
			Price:    item.Price,
			Name:     item.Menu.Name,
		}
	}
	return items
}

func (u *orderUsecase) CancelOrder(ctx context.Context, id int) error {

	tx := u.txManager.Begin()

	defer u.txManager.Rollback(tx)

	err := u.orderItemRepository.DeleteOrderItems(ctx, tx, id)

	if err != nil {
		return err
	}

	err = u.orderRepository.DeleteOrder(ctx, tx, id)
	if err != nil {
		return err
	}

	u.txManager.Commit(tx)
	return nil
}
