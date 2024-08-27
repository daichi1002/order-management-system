package model

import (
	"errors"
	"time"
)

type Order struct {
	Id           int       `json:"id"`
	TicketNumber int       `json:"ticketNumber"`
	OrderDate    time.Time `json:"orderDate"`
	TotalAmount  float64   `json:"totalAmount"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	DeletedAt    time.Time `json:"deletedAt"`
}

func NewOrder(ticketNumber int, orderDate time.Time, totalAmount float64) (*Order, error) {
	o := &Order{
		TicketNumber: ticketNumber,
		OrderDate:    orderDate,
		TotalAmount:  totalAmount,
	}

	if err := o.validate(); err != nil {
		return nil, err
	}

	return o, nil
}

func (o *Order) validate() error {
	if o.TicketNumber == 0 {
		return errors.New("番号札が正しく入力されていません")
	}

	if o.TotalAmount == 0 {
		return errors.New("合計金額が正しく入力されていません")
	}

	return nil
}
