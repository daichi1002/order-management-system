package usecase

import (
	"context"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
)

type dailyClosingUsecase struct {
	repo repository.DailyClosingRepository
}

func NewDailyClosingUsecase(repo repository.DailyClosingRepository) DailyClosingUsecase {
	return &dailyClosingUsecase{repo}
}

func (u *dailyClosingUsecase) CreateDailyClosings(ctx context.Context, input model.DailyClosing) error {
	err := u.repo.CreateDailyClosing(ctx, input)

	if err != nil {
		return err
	}

	return nil
}

func (u *dailyClosingUsecase) IsSalesConfirmed(ctx context.Context, dateTime time.Time) (bool, error) {
	// 日付のみの形式に変更
	date := dateTime.Format("2006-01-02")
	exist, err := u.repo.IsSalesConfirmed(ctx, date)

	if err != nil {
		return false, err
	}

	return exist, nil
}
