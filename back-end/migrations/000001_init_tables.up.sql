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


-- Create product_image table
CREATE TABLE IF NOT EXISTS product_image (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE,
  url VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
