package repository

import (
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"gorm.io/gorm"
)

type menuRepository struct {
	db *gorm.DB
}

func NewMenuRepository(db *gorm.DB) MenuRepository {
	return &menuRepository{db}
}

func (r *menuRepository) GetMenus() ([]model.Menu, error) {
	var menus []model.Menu
	if err := r.db.Find(&menus).Error; err != nil {
		return nil, err
	}
	return menus, nil
}
