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
  weight FLOAT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  capital DECIMAL NOT NULL,
  department VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);


-- Create product_image table
CREATE TABLE IF NOT EXISTS product_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE,
  url VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);