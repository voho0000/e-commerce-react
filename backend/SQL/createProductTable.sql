ALTER TABLE product
ADD num_reviews int;

ALTER TABLE product
ADD rating int;

UPDATE product
SET rating = ROUND(random() * (5 - 1) + 1);

UPDATE product
SET num_reviews = ROUND(random() * (20 - 1) + 1);

alter table product 
add featured int;

UPDATE product
SET featured = ROUND(random());

alter table product 
rename column launch_date to created_time;

alter table product 
add column brand varchar;

CREATE SEQUENCE product_id_seq OWNED BY product.id;
SELECT setval('product_id_seq', coalesce(max(id), 0) + 1, false) FROM member;
ALTER TABLE product ALTER COLUMN id SET DEFAULT nextval('product_id_seq');