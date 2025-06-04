CREATE TABLE IF NOT EXISTS customer_address (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    recipients_name VARCHAR(255) NOT NULL,
    recipients_number VARCHAR(255) NOT NULL,
    destination_id VARCHAR(255),
    address VARCHAR(255),
    zip_code VARCHAR(255),
    destination_label VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);