package repository

import (
	"context"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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

func (r *orderRepository) GetOrdersWithDetails(ctx context.Context, dateTime time.Time) ([]*model.Order, error) {
	var orders []*model.Order
	startOfDay := time.Date(dateTime.Year(), dateTime.Month(), dateTime.Day(), 0, 0, 0, 0, dateTime.Location())
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

func (r *orderRepository) DeleteOrder(ctx context.Context, tx *gorm.DB, id int) (*model.Order, error) {
	var order model.Order
	result := tx.WithContext(ctx).Model(&order).Where("id = ?", id).Clauses(clause.Returning{}).Delete(&order)

	if result.Error != nil {
		return nil, result.Error
	}

	return &order, nil
}
