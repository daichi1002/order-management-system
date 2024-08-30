package repository

import (
	"context"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type orderItemRepository struct {
	db *gorm.DB
}

func NewOrderItemRepository(db *gorm.DB) OrderItemRepository {
	return &orderItemRepository{db}
}

func (r *orderItemRepository) CreateOrderItems(ctx context.Context, tx *gorm.DB, data []*model.OrderItem) error {

	if err := tx.Omit("DeletedAt").Create(data).Error; err != nil {
		return err
	}

	return nil
}

func (r *orderItemRepository) DeleteOrderItems(ctx context.Context, tx *gorm.DB, id int) error {
	result := tx.WithContext(ctx).Where("order_id = ?", id).Delete(&model.OrderItem{})

	if result.Error != nil {
		return result.Error
	}

	return nil
}
