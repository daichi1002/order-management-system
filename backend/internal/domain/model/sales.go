package model

import (
	"time"

	"gorm.io/gorm"
)

type Sales struct {
	Id          int            `gorm:"primaryKey" json:"id"`
	Date        string         `gorm:"type:date" json:"date"`
	TotalSales  float64        `json:"totalSales"`
	TotalOrders int            `json:"totalOrders"`
	CreatedAt   *time.Time     `json:"-"`
	UpdatedAt   *time.Time     `json:"-"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
