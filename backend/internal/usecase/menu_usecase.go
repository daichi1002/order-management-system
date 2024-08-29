package usecase

import (
	"context"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
)

type menuUsecase struct {
	repo repository.MenuRepository
}

func NewMenuUsecase(repo repository.MenuRepository) MenuUsecase {
	return &menuUsecase{repo}
}

func (u *menuUsecase) GetMenus(ctx context.Context) ([]model.Menu, error) {
	return u.repo.GetMenus()
}
