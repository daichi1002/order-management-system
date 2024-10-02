up:
	docker-compose up -d

run:
	go run ./cmd/server/main.go

migrate-up:
	migrate -path ./migrations -database 'postgres://postgres:password@localhost:5432/order-management?sslmode=disable' -verbose up

migrate-down:
	migrate -path ./migrations -database 'postgres://postgres:password@localhost:5432/order-management?sslmode=disable' -verbose down 1

generate:
	go run github.com/99designs/gqlgen generate

batch:
	go run ./cmd/batch/main.go

mock:
	mockgen -source=./internal/infrastructure/database/transaction.go \
	-destination=./internal/infrastructure/database/mock/mock_transaction.go \
	-package=mock_database