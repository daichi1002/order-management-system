package usecase

import (
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/daichi1002/order-management-system/backend/internal/util"
	"gorm.io/gorm"
)

type counterUsecase struct {
	repo repository.CounterRepository
}

func NewCounterUsecase(repo repository.CounterRepository) CounterUsecase {
	return &counterUsecase{repo}
}

func (u *counterUsecase) GetNextNumber(tx *gorm.DB) (int, error) {
	currentDate := util.NowFunc().Format("2006-01-02")

	// 現在の日付のレコードが存在するか確認
	counter, err := u.repo.GetNextNumber(currentDate)

	if err != nil {
		return 0, err
	}

	// レコードが存在しない場合、新しく追加して番号を1にリセット
	if counter == nil {
		newCounter := &model.Counter{
			Date:   currentDate,
			Number: 1,
		}

		if err := u.repo.CreateNumber(tx, newCounter); err != nil {
			return 0, err
		}

		return newCounter.Number, nil
	}

	// レコードが存在する場合、番号をインクリメント
	counter.Number++
	if err := u.repo.UpdateNumber(tx, counter); err != nil {
		return 0, err
	}

	return counter.Number, nil
}
