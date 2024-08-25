FROM golang:1.23-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy

COPY . .

# ビルドコマンドを修正し、出力先を明示的に指定
RUN go build -o /app/main ./cmd/server

# 実行ファイルの場所を明示的に指定
CMD ["/app/main"]
