SELECT CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Tokyo';

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    ticket_number INT NOT NULL,
    order_date TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP with time zone DEFAULT NULL
);

CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP with time zone DEFAULT NULL
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    menu_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP with time zone DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

CREATE TABLE daily_closings (
    id SERIAL PRIMARY KEY,
    closing_date DATE NOT NULL,
    total_sales DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_orders INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP with time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP with time zone DEFAULT NULL
);
