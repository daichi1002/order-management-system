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

func (r *salesRepository) CreateSales(tx *gorm.DB, data model.Sales) error {
	result := tx.Omit("DeletedAt").Create(&data)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *salesRepository) GetSalesByDate(ctx context.Context, date string) (*model.Sales, error) {
	var sales *model.Sales
	result := r.db.Where(&model.Sales{Date: date}).Find(&sales)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, nil
	}

	return sales, nil
}
