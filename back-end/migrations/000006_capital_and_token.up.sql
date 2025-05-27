CREATE TABLE IF NOT EXISTS invalid_token (
    token TEXT PRIMARY KEY,
    expires TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE capital (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    total_stock INT NOT NULL,
    capital_per_item DECIMAL(10, 2) NOT NULL,
    total_capital DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (product_id) REFERENCES product(id)
);
