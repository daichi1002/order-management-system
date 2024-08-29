# 注文管理システム（バックエンド）

## 環境構築手順

1. Docker を起動する
2. backend ディレクトリに移動する
3. 以下のコマンドで api サーバーコンテナ、db コンテナを起動する

```
make up
```

4. 以下のコマンドでコンテナ内に入る

```
docker exec -it backend-api-1 /bin/sh
```

5. 以下のコマンドを実行し、サーバーが起動していることを確認する

```
make run
```

## ディレクトリ構成

<pre>
.
├── cmd
│   └── server
│       └── main.go    # エントリーポイント
├── internal
│   ├── adapter        # インターフェースアダプタ層
│   │   ├── graph      # graphqlに関連するコード
│   │   └── repository # データベースリポジトリの実装
│   ├── domain         # ドメイン層
│   │   └── model      # エンティティ、バリューオブジェクト
│   ├── infrastructure # インフラ層
│   │   ├── database   # データベース接続
│   │   └── logger     # ロギング
│   └── usecase        # ユースケース層
├── go.mod             # モジュール定義ファイル
└── go.sum             # モジュールバージョン管理ファイル
</pre>

## マイグレーション手順

1. golang-migrate をインストールする (https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md)
2. DB コンテナを起動する
3. 以下のコマンドを実行して、データベースの変更を反映する

```
make migrate-up
```

※ マイグレーションのバージョンを 1 つ前に戻したい場合は以下のコマンドを実行する

```
make migrate-down
```

<details><summary>テストデータを登録したい場合は、以下のクエリを実行する</summary>

```
-- `menus` テーブルにテストデータを挿入
INSERT INTO "menus" ("name", "price", "available", "created_at", "updated_at")
VALUES
    ('親子丼', 800.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('アジフライ定食', 750.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('長崎皿うどん', 850.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ハンバーグ定食', 850.00, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- `orders` テーブルにテストデータを挿入
INSERT INTO "orders" ("ticket_number", "order_date", "total_amount", "created_at", "updated_at")
VALUES
    (1, CURRENT_TIMESTAMP, 2450.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, CURRENT_TIMESTAMP, 750.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, CURRENT_TIMESTAMP, 850.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- `order_items` テーブルにテストデータを挿入
INSERT INTO "order_items" ("order_id", "menu_id", "quantity", "price", "created_at", "updated_at")
VALUES
    (1, 1, 2, 800.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 3, 1, 850.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 2, 1, 750.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 4, 1, 850.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- `daily_closings` テーブルにテストデータを挿入
INSERT INTO "daily_closings" ("closing_date", "total_sales", "total_orders", "total_voids", "notes", "created_at", "updated_at")
VALUES
    ('2024-08-23', 4050.00, 3, 0, 'No special notes.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

```

</details>
