package usecase_test

import (
	"testing"

	mock_repository "github.com/daichi1002/order-management-system/backend/internal/adapter/repository/mock"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	mock_database "github.com/daichi1002/order-management-system/backend/internal/infrastructure/database/mock"
	"github.com/daichi1002/order-management-system/backend/internal/usecase"
	"github.com/daichi1002/order-management-system/backend/internal/util"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestCounterUsecase(t *testing.T) {
	currentDate := util.NowFunc().Format("2006-01-02")
	// テストケース
	testCases := []struct {
		name            string
		expectedCounter *model.Counter
		expectedError   error
		prepareMockFn   func(
			mockRepo *mock_repository.MockCounterRepository,
			mockTx *gorm.DB,
		)
	}{
		{
			name:          "成功：番号がインクリメントされる",
			expectedError: nil,
			prepareMockFn: func(
				mockRepo *mock_repository.MockCounterRepository,
				mockTx *gorm.DB,
			) {
				mockRepo.EXPECT().GetNextNumber(currentDate).Return(&model.Counter{
					ID: 1, Date: "2024-10-01", Number: 10,
				}, nil)
				mockRepo.EXPECT().UpdateNumber(mockTx, &model.Counter{
					ID: 1, Date: "2024-10-01", Number: 11,
				}).Return(nil)

			},
		},
		{
			name: "成功：新しいレコードが生成される",
			expectedCounter: &model.Counter{
				ID: 0, Date: currentDate, Number: 1,
			},
			expectedError: nil,
			prepareMockFn: func(
				mockRepo *mock_repository.MockCounterRepository,
				mockTx *gorm.DB,
			) {
				mockRepo.EXPECT().GetNextNumber(currentDate).Return(nil, nil)
				mockRepo.EXPECT().CreateNumber(mockTx, &model.Counter{
					ID: 0, Date: currentDate, Number: 1,
				}).Return(nil)

			},
		},
		{
			name:            "失敗：エラーが返される",
			expectedCounter: nil,
			expectedError:   assert.AnError,
			prepareMockFn: func(
				mockRepo *mock_repository.MockCounterRepository,
				mockTx *gorm.DB,
			) {
				mockRepo.EXPECT().GetNextNumber(currentDate).Return(nil, assert.AnError)
			},
		},
	}

	// モックコントローラーの設定
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// モックリポジトリの設定
			mockRepo := mock_repository.NewMockCounterRepository(ctrl)
			mockTransaction := mock_database.NewMockTxManager(ctrl)
			mockTx := &gorm.DB{}
			tc.prepareMockFn(mockRepo, mockTx)

			// 各テストケースでモックトランザクションを設定
			mockTransaction.EXPECT().Begin().Return(mockTx)

			// テスト対象のusecaseを作成
			usecase := usecase.NewCounterUsecase(mockRepo)

			// トランザクションを開始
			tx := mockTransaction.Begin()

			// GetNextNumberメソッドを実行
			number, err := usecase.GetNextNumber(tx)

			// アサーション
			if tc.expectedCounter != nil {
				assert.Equal(t, tc.expectedCounter.Number, number)
			}
			assert.Equal(t, tc.expectedError, err)
		})
	}

}
