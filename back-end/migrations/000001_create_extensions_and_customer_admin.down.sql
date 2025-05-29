DELETE FROM admin WHERE username = 'owner';
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS customer;
DROP EXTENSION IF EXISTS "pgcrypto";
