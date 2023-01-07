CREATE TABLE Review(
    id SERIAL primary key,
	product_id int NOT NULL,
	user_id int NOT NULL,
	review_date timestamp NOT NULL,
	rating int NOT NULL,
	comment varchar,
	image_url varchar,
	foreign key (product_id) references product(id) on update cascade on delete cascade,
	foreign key (user_id) references member(id) on update cascade on delete cascade);
