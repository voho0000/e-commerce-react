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
	image_url varchar NOT NULL,
	foreign key (order_id) references orders(id) on update cascade on delete cascade,
	foreign key (product_id) references product(id) on update cascade on delete cascade
);

CREATE TABLE shipping_address(
	id SERIAL primary key NOT NULL ,
	order_id int NOT NULL,
	fullname varchar NOT NULL,
	phone int NOT NULL,
	address varchar NOT NULL,
	city varchar NOT NULL,
	postal_code int,
	country varchar,
	foreign key (order_id) references orders(id) on update cascade on delete cascade
	);

CREATE TABLE shipping_coupon(
	id SERIAL primary key NOT NULL ,
	name varchar NOT NULL,
	price_criteria int default 0 NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	max_num int NOT NULL,
	code varchar NOT NULL
	);

CREATE TABLE discount_coupon(
	id SERIAL primary key NOT NULL ,
	name varchar NOT NULL,
	price_criteria int default 0 NOT NULL,
	discount_num int NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	max_num int NOT NULL,
	code varchar NOT NULL
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

