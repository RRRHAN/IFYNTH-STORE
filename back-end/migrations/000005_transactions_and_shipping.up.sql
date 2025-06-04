CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
    payment_proof VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    last_handle_by UUID DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES customer(id),
    FOREIGN KEY (last_handle_by) REFERENCES admin(id)
);

CREATE TABLE shipping_address (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR NOT NULL,
    address VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    destination_label VARCHAR(255) NOT NULL,
    courir VARCHAR(255) NOT NULL,
    shipping_cost DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE transaction_details (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL,
    product_id UUID NOT NULL,
    size VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
