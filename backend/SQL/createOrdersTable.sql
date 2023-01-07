DROP TABLE orders CASCADE; 

CREATE TABLE orders(
	id SERIAL primary key NOT NULL ,
	user_id int NOT NULL,
	create_time TIMESTAMP NOT NULL,
	items_price int NOT NULL, 
	shipping_price int NOT NULL, 
	discount_price int NOT NULL,
	total_price int NOT NULL,
	isCoupon boolean default false,
	isPaid boolean default false,
	payment_method varchar NOT NULL,
	paid_time TIMESTAMP,
	isDelivered boolean default false,
	delivered_time TIMESTAMP,
	foreign key (user_id) references member(id) on update cascade on delete cascade
);

CREATE TABLE purchase_item (
	id SERIAL primary key NOT NULL ,
	order_id int NOT NULL,
	product_id int NOT NULL,
	name varchar NOT NULL,
	quantity int NOT NULL, 
	price int NOT NULL, 
	foreign key (order_id) references orders(id) on update cascade on delete cascade,
	foreign key (product_id) references product(id) on update cascade on delete cascade
);

CREATE TABLE address(
	id SERIAL primary key NOT NULL ,
	order_id int NOT NULL,
	fullname varchar,
	phone int,
	address varchar,
	city varchar,
	postal_code int,
	country varchar,
	foreign key (order_id) references orders(id) on update cascade on delete cascade
	);

CREATE TABLE shipping_coupon(
	id SERIAL primary key NOT NULL ,
	name varchar,
	price_criteria int default 0,
	start_date DATE,
	end_date DATE,
	max_num int,
	code varchar
	);

CREATE TABLE discount_coupon(
	id SERIAL primary key NOT NULL ,
	name varchar,
	price_criteria int default 0,
	discount_num int,
	start_date DATE,
	end_date DATE,
	max_num int,
	code varchar
	);



CREATE TABLE used_shipping_coupon(
	id SERIAL primary key NOT NULL ,
	coupon_id int NOT NULL,
	order_id int NOT NULL,
	foreign key (order_id) references orders(id) on update cascade on delete cascade,
	foreign key (coupon_id) references shipping_coupon(id) on update cascade on delete cascade
	);

CREATE TABLE used_discount_coupon(
	id SERIAL primary key NOT NULL ,
	coupon_id int NOT NULL,
	order_id int NOT NULL,
	foreign key (order_id) references orders(id) on update cascade on delete cascade,	
	foreign key (coupon_id) references discount_coupon(id) on update cascade on delete cascade
	);

