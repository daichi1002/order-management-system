package model

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type DailyClosing struct {
	Id          int            `gorm:"primaryKey" json:"id"`
	ClosingDate time.Time      `gorm:"type:date" json:"closingDate"`
	TotalSales  float64        `json:"totalSales"`
	TotalOrders int            `json:"totalOrders"`
	CreatedAt   *time.Time     `json:"-"`
	UpdatedAt   *time.Time     `json:"-"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

func NewDailyClosing(date time.Time, totalSales float64, totalOrders int) (*DailyClosing, error) {
	o := &DailyClosing{
		ClosingDate: date,
		TotalSales:  totalSales,
		TotalOrders: totalOrders,
	}

	if err := o.validate(); err != nil {
		return nil, err
	}

	return o, nil
}

func (o *DailyClosing) validate() error {
	if o.TotalSales <= 0 {
		return errors.New("1件以上の注文を登録してください。")
	}

	if o.TotalOrders <= 0 {
		return errors.New("1件以上の注文を登録してください。")
	}
	return nil
}
