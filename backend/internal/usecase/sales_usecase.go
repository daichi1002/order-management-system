package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/graph/generated"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
	"github.com/daichi1002/order-management-system/backend/internal/infrastructure/database"
	"github.com/daichi1002/order-management-system/backend/internal/util"
)

type salesUsecase struct {
	txManager       database.TxManager
	salesRepository repository.SalesRepository
	orderRepository repository.OrderRepository
}

func NewSalesUsecase(txManager database.TxManager, salesRepository repository.SalesRepository, orderRepository repository.OrderRepository) SalesUsecase {
	return &salesUsecase{txManager, salesRepository, orderRepository}
}

func (u *salesUsecase) GetMonthlySalesData(ctx context.Context, month string) (*generated.MonthlySalesData, error) {
	salesList, err := u.salesRepository.GetMonthlySales(ctx, month)

	if err != nil {
		return nil, err
	}

	var totalSales float64
	var totalOrders int
	var dailySales []*generated.DailySales

	for _, sales := range salesList {
		totalSales += sales.TotalSales
		totalOrders += sales.TotalOrders
		parsedTime, err := time.Parse(time.RFC3339, sales.Date)
		if err != nil {
			return nil, err
		}
		dailySales = append(dailySales, &generated.DailySales{
			Date:  parsedTime.Format("2006-01-02"),
			Sales: sales.TotalSales,
		})
	}

	// 当日の注文を取得する
	if month == util.NowFunc().Format("2006-01") {
		orders, err := u.orderRepository.GetOrdersWithDetails(ctx, util.NowFunc())

		if err != nil {
			return nil, err
		}

		var todaysSales float64
		for _, order := range orders {
			totalSales += order.TotalAmount
			totalOrders += 1

			todaysSales += order.TotalAmount
		}

		dailySales = append(dailySales, &generated.DailySales{
			Date:  util.NowFunc().Format("2006-01-02"),
			Sales: todaysSales,
		})
	}

	return &generated.MonthlySalesData{
		MonthlySummary: &generated.MonthlySummary{
			TotalSales:  totalSales,
			TotalOrders: totalOrders,
		},
		DailySales: dailySales,
	}, nil
}

func (u *salesUsecase) CreateSales(ctx context.Context, date time.Time) error {
	tx := u.txManager.Begin()
	defer u.txManager.Rollback(tx)
	dateStr := date.Format("2006-01-02")
	// 同じ日付のデータがないことをチェック
	salesData, err := u.salesRepository.GetSalesByDate(ctx, dateStr)
	if err != nil {
		return err
	}

	if salesData != nil {
		return errors.New("同じ日付のデータがすでに存在しています。")
	}

	// 指定日のOrderデータの取得
	orders, err := u.orderRepository.GetOrdersWithDetails(ctx, date)
	if err != nil {
		return err
	}

	var totalSales float64
	var totalOrders int

	for _, order := range orders {
		fmt.Println(order.Id)
		totalSales += order.TotalAmount
		totalOrders++
	}

	sales := model.Sales{
		Date:        dateStr,
		TotalSales:  totalSales,
		TotalOrders: totalOrders,
	}
	// salesテーブルへ登録
	err = u.salesRepository.CreateSales(tx, sales)
	if err != nil {
		return err
	}

	u.txManager.Commit(tx)

	return nil
}
