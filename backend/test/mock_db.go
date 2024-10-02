package test

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupTestDB(t *testing.T) (*gorm.DB, sqlmock.Sqlmock, func()) {
	sqlDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}

	dialector := postgres.New(postgres.Config{
		Conn: sqlDB,
	})
	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a gorm database", err)
	}

	return db, mock, func() {
		sqlDB.Close()
	}
}
