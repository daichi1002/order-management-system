package repository

import "github.com/daichi1002/order-management-system/backend/internal/domain/model"

type MenuRepository interface {
	FindAll() ([]model.Menu, error)
}
