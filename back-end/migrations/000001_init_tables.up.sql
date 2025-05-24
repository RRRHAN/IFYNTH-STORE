CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE
  IF NOT EXISTS customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

INSERT INTO
  admin (id, name, username, password, phone_number)
VALUES
  (
    gen_random_uuid (),
    'Super Admin',
    'admin',
    crypt ('admin123', gen_salt ('bf')),
    '08123456789'
  );

CREATE TABLE
  IF NOT EXISTS invalid_token (
    token text PRIMARY KEY,
    expires TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR NOT NULL,
    total_stock INT,
    weight FLOAT,
    description TEXT,
    department VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS product_stock_detail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    product_id UUID NOT NULL,
    size VARCHAR(10) NOT NULL,
    stock DECIMAL NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS product_image (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    product_id UUID NOT NULL REFERENCES product (id) ON DELETE CASCADE ON UPDATE CASCADE,
    url VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS carts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    total_price DECIMAL(10, 2) DEFAULT 0,
    total_quantity INT,
    total_weight FLOAT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID REFERENCES carts (id),
    product_id UUID NOT NULL,
    size VARCHAR NOT NULL,
    quantity INT NOT NULL,
    weight FLOAT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  IF NOT EXISTS cusProduct (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL NOT NULL,
    status VARCHAR(255) DEFAULT 'pending',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    FOREIGN KEY (user_id) REFERENCES customer (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS customer_product_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    product_id UUID NOT NULL,
    url VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    FOREIGN KEY (product_id) REFERENCES cusProduct (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    message text,
    role VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    FOREIGN KEY (product_id) REFERENCES cusProduct (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS transactions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer',
    payment_proof VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
      status IN ('pending', 'proccess', 'canceled', 'success')
    ),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    FOREIGN KEY (user_id) REFERENCES customer (id)
  );

CREATE TABLE
  IF NOT EXISTS shipping_address (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR NOT NULL,
    address VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    destination_label VARCHAR(255) not null,
    courir VARCHAR(255) not null,
    shpiing_cost DECIMAL(12, 2) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    FOREIGN KEY (transaction_id) REFERENCES transactions (id)
  );

CREATE TABLE
  IF NOT EXISTS transaction_details (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    size VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    FOREIGN KEY (transaction_id) REFERENCES transactions (id)
  );

CREATE TABLE
  IF NOT EXISTS capital (
    id UUID PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    total_stock INT NOT NULL,
    capital_per_item DECIMAL(10, 2) NOT NULL,
    total_capital DECIMAL(10, 2) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    FOREIGN KEY (product_id) REFERENCES product (id)
  );