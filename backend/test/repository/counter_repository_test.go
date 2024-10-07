package repository_test

import (
	"errors"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/daichi1002/order-management-system/backend/internal/util"
	"github.com/daichi1002/order-management-system/backend/test"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
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

func TestUpdateNumber(t *testing.T) {
	db, mock, closeDB := test.SetupTestDB(t)
	defer closeDB()

	testCases := []struct {
		name        string
		counter     *model.Counter
		expectError bool
		mockSetup   func(sqlmock.Sqlmock)
	}{
		{
			name: "成功：データが更新できる",
			counter: &model.Counter{
				ID:     1,
				Date:   "2023-10-04",
				Number: 11,
			},
			expectError: false,
			mockSetup: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectExec(regexp.QuoteMeta(`UPDATE "counters" SET "date"=$1,"number"=$2 WHERE "id" = $3`)).
					WithArgs("2023-10-04", 11, 1).
					WillReturnResult(sqlmock.NewResult(1, 1))
				mock.ExpectCommit()
			},
		},
		{
			name: "失敗：データベースエラー",
			counter: &model.Counter{
				ID:     1,
				Date:   "2023-10-04",
				Number: 11,
			},
			expectError: true,
			mockSetup: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectExec(regexp.QuoteMeta(`UPDATE "counters" SET "date"=$1,"number"=$2 WHERE "id" = $3`)).
					WithArgs("2023-10-04", 11, 1).
					WillReturnError(errors.New("database error"))
				mock.ExpectRollback()
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			tc.mockSetup(mock)

			repo := repository.NewCounterRepository(db)

			err := db.Transaction(func(tx *gorm.DB) error {
				return repo.UpdateNumber(tx, tc.counter)
			})

			if tc.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			err = mock.ExpectationsWereMet()
			assert.NoError(t, err)
		})
	}
}

func TestCreateNumber(t *testing.T) {
	db, mock, closeDB := test.SetupTestDB(t)
	defer closeDB()

	testCases := []struct {
		name        string
		counter     *model.Counter
		expectError bool
		mockSetup   func(sqlmock.Sqlmock)
	}{
		{
			name: "成功：データが作成できる",
			counter: &model.Counter{
				Date:   "2023-10-04",
				Number: 11,
			},
			expectError: false,
			mockSetup: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "counters" ("date","number") VALUES ($1,$2) RETURNING "id"`)).
					WithArgs("2023-10-04", 11).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
				mock.ExpectCommit()
			},
		},
		{
			name: "失敗：データベースエラー",
			counter: &model.Counter{
				Date:   "2023-10-04",
				Number: 11,
			},
			expectError: true,
			mockSetup: func(mock sqlmock.Sqlmock) {
				mock.ExpectBegin()
				mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "counters" ("date","number") VALUES ($1,$2) RETURNING "id"`)).
					WithArgs("2023-10-04", 11).
					WillReturnError(errors.New("database error"))
				mock.ExpectRollback()
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			tc.mockSetup(mock)

			repo := repository.NewCounterRepository(db)

			err := db.Transaction(func(tx *gorm.DB) error {
				return repo.CreateNumber(tx, tc.counter)
			})

			if tc.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			err = mock.ExpectationsWereMet()
			assert.NoError(t, err)
		})
	}
}
