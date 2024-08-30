package repository

import (
	"context"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/daichi1002/order-management-system/backend/internal/util"
	"gorm.io/gorm"
)

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db}
}

func (r *orderRepository) CreateOrder(ctx context.Context, tx *gorm.DB, data *model.Order) (int, error) {

	result := tx.Omit("DeletedAt").Create(data)

	if result.Error != nil {
		return 0, nil
	}

	return data.Id, nil
}

func (r *orderRepository) GetTodayOrdersWithDetails(ctx context.Context) ([]*model.Order, error) {
	var orders []*model.Order
	now := util.NowFunc()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	result := r.db.WithContext(ctx).Preload("Items.Menu").
		Where("orders.order_date BETWEEN ? AND ?", startOfDay, endOfDay).
		Order("orders.order_date DESC").
		Find(&orders)

	if result.Error != nil {
		return nil, result.Error
	}
	return orders, nil
}

func (r *orderRepository) DeleteOrder(ctx context.Context, tx *gorm.DB, id int) error {
	result := tx.WithContext(ctx).Where("id = ?", id).Delete(&model.Order{})

	if result.Error != nil {
		return result.Error
	}

	return nil
}
