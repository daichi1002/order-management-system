package usecase

import "github.com/daichi1002/order-management-system/backend/internal/domain/model"

type MenuUsecase interface {
	Handle() ([]model.Menu, error)
}
