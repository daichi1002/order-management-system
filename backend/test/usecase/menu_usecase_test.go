package usecase_test

import (
	"context"
	"testing"

	mock_repository "github.com/daichi1002/order-management-system/backend/internal/adapter/repository/mock"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/daichi1002/order-management-system/backend/internal/usecase"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
)

func TestGetMenus(t *testing.T) {
	// テストケース
	testCases := []struct {
		name          string
		mockMenus     []model.Menu
		mockError     error
		expectedMenus []model.Menu
		expectedError error
	}{
		{
			name: "成功：メニューが返される",
			mockMenus: []model.Menu{
				{Id: 1, Name: "ハンバーガー", Price: 500},
				{Id: 2, Name: "フライドポテト", Price: 300},
			},
			mockError:     nil,
			expectedMenus: []model.Menu{{Id: 1, Name: "ハンバーガー", Price: 500}, {Id: 2, Name: "フライドポテト", Price: 300}},
			expectedError: nil,
		},
		{
			name:          "失敗：エラーが返される",
			mockMenus:     nil,
			mockError:     assert.AnError,
			expectedMenus: nil,
			expectedError: assert.AnError,
		},
	}

	// モックコントローラーの設定
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// モックリポジトリの設定
			mockRepo := mock_repository.NewMockMenuRepository(ctrl)

			// モックの振る舞いを設定
			mockRepo.EXPECT().GetMenus().Return(tc.mockMenus, tc.mockError)

			// テスト対象のusecaseを作成
			usecase := usecase.NewMenuUsecase(mockRepo)

			// GetMenusメソッドを実行
			menus, err := usecase.GetMenus(context.Background())

			// アサーション
			assert.Equal(t, tc.expectedMenus, menus)
			assert.Equal(t, tc.expectedError, err)
		})
	}
}
