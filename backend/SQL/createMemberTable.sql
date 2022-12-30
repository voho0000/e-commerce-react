
CREATE TABLE member (
	id SERIAL primary key NOT NULL ,
    name varchar NOT NULL
    email varchar NOT NULL unique
    password varchar NOT NULL
    token varchar
);