up:
	docker-compose up -d

run:
	go run ./cmd/server/main.go

migrate-up:
	migrate -path ./migrations -database 'mysql://mysql:password@tcp(localhost:3306)/order-management' -verbose up

migrate-down:
	migrate -path ./migrations -database 'mysql://mysql:password@tcp(localhost:3306)/order-management' -verbose down 1