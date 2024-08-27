package usecase

import (
	"context"

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

func (u *orderUsecase) Handle(ctx context.Context, order *model.Order, orderItems []*model.OrderItem) (int, error) {
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
	u.txManager.Commit(tx)

	return id, nil
}
