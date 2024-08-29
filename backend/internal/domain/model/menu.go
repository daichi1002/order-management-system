package model

import (
	"time"

	"gorm.io/gorm"
)

type Menu struct {
	Id        int            `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Price     float64        `json:"price"`
	Available bool           `json:"-"`
	CreatedAt *time.Time     `json:"-"`
	UpdatedAt *time.Time     `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
