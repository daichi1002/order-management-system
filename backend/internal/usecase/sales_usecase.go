package usecase

import (
	"context"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/graph/generated"
	"github.com/daichi1002/order-management-system/backend/internal/adapter/repository"
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
		dailySales = append(dailySales, &generated.DailySales{
			Date:  sales.Date.Format("2006-01-02"),
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
