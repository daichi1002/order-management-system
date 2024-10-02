package repository_test

import (
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/daichi1002/order-management-system/backend/internal/util"
	"github.com/daichi1002/order-management-system/backend/test"
	"github.com/stretchr/testify/assert"
)

func TestGetNextNumber(t *testing.T) {
	db, mock, closeDB := test.SetupTestDB(t)
	defer closeDB()

	testCases := []struct {
		name            string
		expectedCounter *model.Counter
		expectError     bool
	}{
		{
			name: "成功：データが取得できる",
			expectedCounter: &model.Counter{
				ID:     1,
				Date:   util.NowFunc().Format("2006-01-02"),
				Number: 10,
			},
			expectError: false,
		},
		{
			name:            "成功：データが空の場合",
			expectedCounter: &model.Counter{},
			expectError:     false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			rows := sqlmock.NewRows([]string{"id", "date", "number", "created_at", "updated_at", "deleted_at"})
			rows.AddRow(tc.expectedCounter.ID, tc.expectedCounter.Date, tc.expectedCounter.Number, time.Now(), time.Now(), nil)

			mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "counters" WHERE date = $1`)).
				WithArgs(util.NowFunc().Format("2006-01-02")).WillReturnRows(rows)

			repo := repository.NewCounterRepository(db)

			counter, err := repo.GetNextNumber(util.NowFunc().Format("2006-01-02"))

			if tc.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tc.expectedCounter.ID, counter.ID)
				assert.Equal(t, tc.expectedCounter.Date, counter.Date)
				assert.Equal(t, tc.expectedCounter.Number, counter.Number)

			}

			err = mock.ExpectationsWereMet()
			assert.NoError(t, err)
		})
	}
}
