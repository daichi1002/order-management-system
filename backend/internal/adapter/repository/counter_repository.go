package repository

import (
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type counterRepository struct {
	db *gorm.DB
}

func NewCounterRepository(db *gorm.DB) CounterRepository {
	return &counterRepository{db}
}

func (r *counterRepository) GetNextNumber(date string) (*model.Counter, error) {
	var counter model.Counter
	result := r.db.Find(&counter, "date = ?", date)

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, nil
	}

	return &counter, nil
}

func (r *counterRepository) UpdateNumber(tx *gorm.DB, data *model.Counter) error {
	result := tx.Save(data)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *counterRepository) CreateNumber(tx *gorm.DB, data *model.Counter) error {
	result := tx.Create(data)

	if result.Error != nil {
		return result.Error
	}

	return nil
}
