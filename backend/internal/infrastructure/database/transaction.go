package database

import (
	"gorm.io/gorm"
)

type TxManager interface {
	Begin() *gorm.DB
	Commit(*gorm.DB)
	Rollback(*gorm.DB)
}

type txManager struct {
	db *gorm.DB
}

func NewTxManager(db *gorm.DB) TxManager {
	return &txManager{db: db}
}

func (tm *txManager) Begin() *gorm.DB {
	return tm.db.Begin()
}

func (tm *txManager) Commit(tx *gorm.DB) {
	tx.Commit()
}

func (tm *txManager) Rollback(tx *gorm.DB) {
	tx.Rollback()
}
