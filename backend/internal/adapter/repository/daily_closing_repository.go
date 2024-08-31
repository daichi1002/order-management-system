package repository

import (
	"context"

	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type dailyClosingRepository struct {
	db *gorm.DB
}

func NewDailyClosingRepository(db *gorm.DB) DailyClosingRepository {
	return &dailyClosingRepository{db}
}

func (r *dailyClosingRepository) CreateDailyClosing(ctx context.Context, input model.DailyClosing) error {
	result := r.db.Omit("DeletedAt").Create(&input)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *dailyClosingRepository) IsSalesConfirmed(ctx context.Context, date string) (bool, error) {
	var count int64
	result := r.db.Model(&model.DailyClosing{}).Where("closing_date", date).Count(&count)

	if result.Error != nil {
		return false, result.Error
	}

	if count > 0 {
		return true, nil
	}

	return false, nil
}
