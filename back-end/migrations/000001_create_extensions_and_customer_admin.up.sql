CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    username VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    description text NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


INSERT INTO admin (id, name, username, password, phone_number)
VALUES (
    gen_random_uuid(),
    'Owner',
    'owner',
    '$2a$12$vOjv0wZXqvxli46pQbF.OuCaUQWWzo2/RrxXctSo8W7YYgiU5mYGq',
    '08123456789'
);
