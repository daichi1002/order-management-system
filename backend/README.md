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

5. 以下のコマンドを実行し、「Hello World!」が表示されることを確認する

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
│   │   ├── handler    # HTTP ハンドラ
│   │   └── repository # データベースリポジトリの実装
│   ├── di             # Dependency Injection(依存性注入)
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
-- テストデータを `menus` テーブルに挿入
INSERT INTO `menus` (`name`, `price`, `available`, `created_at`, `updated_at`)
VALUES
    ('親子丼', 800.00, TRUE, NOW(), NOW()),
    ('アジフライ定食', 750.00, TRUE, NOW(), NOW()),
    ('長崎皿うどん', 850.00, TRUE, NOW(), NOW()),
    ('ハンバーグ定食', 850.00, TRUE, NOW(), NOW());

-- テストデータを `orders` テーブルに挿入
INSERT INTO `orders` (`numbered_ticket`, `order_date`, `total_amount`, `created_at`, `updated_at`)
VALUES
    (1, '2024-08-23 12:34:56', 2450.00, NOW(), NOW()),
    (2, '2024-08-23 13:45:00', 750.00, NOW(), NOW()),
    (3, '2024-08-23 14:15:30', 850.00, NOW(), NOW());

-- テストデータを `order_items` テーブルに挿入
INSERT INTO `order_items` (`order_id`, `menu_id`, `quantity`, `price`, `created_at`, `updated_at`)
VALUES
    (1, 1, 2, 800.00, NOW(), NOW()),
    (1, 3, 1, 850.00, NOW(), NOW()),
    (2, 2, 1, 750.00, NOW(), NOW()),
    (3, 4, 1, 850.00, NOW(), NOW());

-- テストデータを `daily_closings` テーブルに挿入
INSERT INTO `daily_closings` (`closing_date`, `total_sales`, `total_orders`, `total_voids`, `notes`, `created_at`, `updated_at`)
VALUES
    ('2024-08-23', 4050.00, 3, 0, 'No special notes.', NOW(), NOW());
```

</details>
