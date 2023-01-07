
CREATE TABLE member (
	id SERIAL primary key NOT NULL ,
    name varchar NOT NULL,
    email varchar NOT NULL unique,
    password varchar NOT NULL,
    isadmin INT NOT NULL DEFAULT 0,
);

CREATE TABLE cart_item (
    user_id int NOT NULL,
    product_id int NOT NULL,
    quantity int NOT NULL,
    foreign key (user_id) references member(id) on update cascade on delete cascade,
    foreign key (product_id) references product(id) on update cascade on delete cascade
);

