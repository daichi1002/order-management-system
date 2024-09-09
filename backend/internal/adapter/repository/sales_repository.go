package repository

import (
	"context"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type salesRepository struct {
	db *gorm.DB
}

func NewSalesRepository(db *gorm.DB) SalesRepository {
	return &salesRepository{db}
}

func (r *salesRepository) GetMonthlySales(ctx context.Context, month string) ([]model.Sales, error) {
	var sales []model.Sales
	result := r.db.WithContext(ctx).Raw(`
		SELECT id, date, total_sales, total_orders
		FROM sales
		WHERE DATE_TRUNC('month', date) = TO_DATE($1, 'YYYY-MM')
	`, month).Scan(&sales)

	if result.Error != nil {
		return nil, result.Error
	}

	return sales, nil
}
