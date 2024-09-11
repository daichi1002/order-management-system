package model

import (
	"time"

	"gorm.io/gorm"
)

type Menu struct {
	Id        int            `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Price     float64        `json:"price"`
	CreatedAt *time.Time     `json:"-"`
	UpdatedAt *time.Time     `json:"-"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func NewMenu(menuId int, name string, price float64) (*Menu, error) {
	o := &Menu{
		Id:    menuId,
		Name:  name,
		Price: price,
	}

	return o, nil
}
