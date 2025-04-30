CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO admin (id, name, username, password, phone_number)
VALUES (
    gen_random_uuid(),
    'Super Admin',
    'admin',
    crypt('admin123', gen_salt('bf')),
    '08123456789'
);


CREATE TABLE invalid_token (
    token text PRIMARY KEY,
    expires TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  total_stock DECIMAL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  capital DECIMAL NOT NULL,
  department VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS product_stock_detail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    size VARCHAR(10) NOT NULL,
    stock DECIMAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);


-- Create product_image table
CREATE TABLE IF NOT EXISTS product_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE,
  url VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  total_price DECIMAL(10, 2) DEFAULT 0,
  total_quantity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY,
  cart_id UUID REFERENCES carts(id),
  product_id UUID NOT NULL,
  size string NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,  -- Harga produk, bisa diambil dari tabel produk jika diperlukan
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel utama: cusProduct
CREATE TABLE cusProduct (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL NOT NULL,
    status VARCHAR(255) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id)
      REFERENCES customer(id)
      ON DELETE CASCADE
);

CREATE TABLE customer_product_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) 
      REFERENCES cusProduct(id)
      ON DELETE CASCADE
);