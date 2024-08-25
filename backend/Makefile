up:
	docker-compose up -d

run:
	go run ./cmd/server/main.go

migrate-up:
	migrate -path ./migrations -database 'postgres://postgres:password@localhost:5432/order-management?sslmode=disable' -verbose up

migrate-down:
	migrate -path ./migrations -database 'postgres://postgres:password@localhost:5432/order-management?sslmode=disable' -verbose down 1