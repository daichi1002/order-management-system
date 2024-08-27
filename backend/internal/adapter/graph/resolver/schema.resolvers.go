package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.49

import (
	"context"
	"time"

	"github.com/daichi1002/order-management-system/backend/internal/adapter/graph/generated"
	"github.com/daichi1002/order-management-system/backend/internal/domain/model"
)

// CreateOrder is the resolver for the createOrder field.
func (r *mutationResolver) CreateOrder(ctx context.Context, input generated.OrderInput) (int, error) {
	order, err := model.NewOrder(input.TicketNumber, time.Time(input.CreatedAt), input.TotalAmount)
	if err != nil {
		return 0, err
	}

	var orderItems []*model.OrderItem
	for _, o := range input.Items {
		item, err := model.NewOrderItem(o.Menu.ID, o.Quantity, o.Price)
		if err != nil {
			return 0, err
		}
		orderItems = append(orderItems, item)
	}
	id, err := r.orderUsecase.Handle(ctx, order, orderItems)

	if err != nil {
		return 0, err
	}

	return id, nil
}

// Menus is the resolver for the menus field.
func (r *queryResolver) Menus(ctx context.Context) ([]*generated.Menu, error) {
	menus, err := r.menuUsecase.Handle(ctx)

	if err != nil {
		return nil, err
	}

	var response []*generated.Menu
	for _, menu := range menus {
		response = append(response, &generated.Menu{
			ID:    menu.Id,
			Name:  menu.Name,
			Price: menu.Price,
		})
	}
	return response, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
