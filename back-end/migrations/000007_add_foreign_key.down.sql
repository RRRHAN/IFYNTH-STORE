ALTER TABLE carts
DROP CONSTRAINT fk_user;

ALTER TABLE cart_items
DROP CONSTRAINT fk_product;

ALTER TABLE message
ADD COLUMN user_id UUID;

UPDATE message
SET user_id = customer_id
WHERE role = 'CUSTOMER';

UPDATE message
SET user_id = admin_id
WHERE role = 'ADMIN';

ALTER TABLE message
DROP COLUMN admin_id,
DROP COLUMN customer_id;
