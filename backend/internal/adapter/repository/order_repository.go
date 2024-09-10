package repository

import (
	"context"
	"log"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
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

func (r *orderRepository) DeleteOrder(ctx context.Context, tx *gorm.DB, id int) error {
	result := tx.WithContext(ctx).Where("id = ?", id).Delete(&model.Order{})

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *orderRepository) GetAggregatedOrder(tx *gorm.DB, date time.Time) (model.AggregatedOrder, error) {
	startOfDay := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	var result model.AggregatedOrder
	err := tx.Model(&model.Order{}).
		Select("COALESCE(SUM(total_amount), 0) as total_sales, COUNT(*) as total_orders").
		Where("orders.order_date BETWEEN ? AND ?", startOfDay, endOfDay).
		Scan(&result).Error
	if err != nil {
		tx.Rollback()
		log.Fatalf("Error executing aggregation query: %v", err)
	}
	return result, nil
}
