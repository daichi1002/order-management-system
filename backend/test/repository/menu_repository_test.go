package repository_test

import (
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func TestGetMenus(t *testing.T) {
	sqlDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer sqlDB.Close()

	dialector := postgres.New(postgres.Config{
		Conn: sqlDB,
	})
	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a gorm database", err)
	}

	testCases := []struct {
		name          string
		expectedMenus []model.Menu
		expectError   bool
	}{
		{
			name: "成功：メニューが取得できる",
			expectedMenus: []model.Menu{
				{Id: 1, Name: "ハンバーガー", Price: 500},
				{Id: 2, Name: "フライドポテト", Price: 300},
			},
			expectError: false,
		},
		{
			name:          "成功：メニューが空の場合",
			expectedMenus: []model.Menu{},
			expectError:   false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rows := sqlmock.NewRows([]string{"id", "name", "price", "created_at", "updated_at", "deleted_at"})
			for _, menu := range tc.expectedMenus {
				rows.AddRow(menu.Id, menu.Name, menu.Price, time.Now(), time.Now(), nil)
			}

			mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "menus" WHERE "menus"."deleted_at" IS NULL`)).WillReturnRows(rows)

			repo := repository.NewMenuRepository(db)

			menus, err := repo.GetMenus()

			if tc.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, len(tc.expectedMenus), len(menus))
				for i, expectedMenu := range tc.expectedMenus {
					assert.Equal(t, expectedMenu.Id, menus[i].Id)
					assert.Equal(t, expectedMenu.Name, menus[i].Name)
					assert.Equal(t, expectedMenu.Price, menus[i].Price)
				}
			}

			err = mock.ExpectationsWereMet()
			assert.NoError(t, err)
		})
	}
}
