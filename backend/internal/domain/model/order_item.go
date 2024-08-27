package model

import (
	"errors"
	"time"
)

type OrderItem struct {
	Id        int       `json:"id"`
	OrderId   int       `json:"orderId"`
	MenuId    int       `json:"menuId"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt time.Time `json:"deletedAt"`
}

func NewOrderItem(menuId, quantity int, price float64) (*OrderItem, error) {
	o := &OrderItem{
		MenuId:   menuId,
		Quantity: quantity,
		Price:    price,
	}

	if err := o.validate(); err != nil {
		return nil, err
	}

	return o, nil
}

func (o *OrderItem) validate() error {
	if o.MenuId == 0 {
		return errors.New("メニューが正しく選択されていません")
	}

	if o.Quantity == 0 {
		return errors.New("数量が正しく入力できていません")
	}

	if o.Price == 0 {
		return errors.New("価格が正しく入力できていません")
	}
	return nil
}
