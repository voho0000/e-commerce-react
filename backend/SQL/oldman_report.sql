--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: shipping_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_address (
    id integer NOT NULL,
    order_id integer NOT NULL,
    fullname character varying,
    phone integer,
    address character varying,
    city character varying,
    postal_code integer,
    country character varying
);


ALTER TABLE public.shipping_address OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.address_id_seq OWNER TO postgres;

--
-- Name: address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_id_seq OWNED BY public.shipping_address.id;


--
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item (
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- Name: discount_coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount_coupon (
    id integer NOT NULL,
    price_criteria integer DEFAULT 0,
    discount_num integer,
    name character varying,
    start_date date,
    end_date date,
    max_num integer,
    code character varying
);


ALTER TABLE public.discount_coupon OWNER TO postgres;

--
-- Name: discount_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discount_coupon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.discount_coupon_id_seq OWNER TO postgres;

--
-- Name: discount_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discount_coupon_id_seq OWNED BY public.discount_coupon.id;


--
-- Name: member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member (
    id integer NOT NULL,
    email character varying NOT NULL,
    name character varying,
    password character varying NOT NULL,
    isadmin integer NOT NULL
);


ALTER TABLE public.member OWNER TO postgres;

--
-- Name: member_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.member_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.member_id_seq OWNER TO postgres;

--
-- Name: member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.member_id_seq OWNED BY public.member.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    create_time timestamp without time zone NOT NULL,
    items_price integer NOT NULL,
    shipping_price integer NOT NULL,
    discount_price integer NOT NULL,
    total_price integer NOT NULL,
    iscoupon boolean DEFAULT false,
    ispaid boolean DEFAULT false,
    payment_method character varying NOT NULL,
    paid_time timestamp without time zone,
    isdelivered boolean DEFAULT false,
    delivered_time timestamp without time zone
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying NOT NULL,
    category character varying,
    description character varying,
    price integer NOT NULL,
    image_url character varying NOT NULL,
    created_time timestamp without time zone NOT NULL,
    discontinue_date timestamp without time zone,
    countinstock integer,
    rating integer,
    num_reviews integer,
    featured integer,
    brand character varying
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: purchase_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_item (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    name character varying NOT NULL,
    quantity integer NOT NULL,
    price integer NOT NULL,
    image_url character varying
);


ALTER TABLE public.purchase_item OWNER TO postgres;

--
-- Name: purchase_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_item_id_seq OWNER TO postgres;

--
-- Name: purchase_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_item_id_seq OWNED BY public.purchase_item.id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    review_date timestamp without time zone NOT NULL,
    rating integer NOT NULL,
    comment character varying,
    image_url character varying
);


ALTER TABLE public.review OWNER TO postgres;

--
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_id_seq OWNER TO postgres;

--
-- Name: review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_id_seq OWNED BY public.review.id;


--
-- Name: shipping_coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_coupon (
    id integer NOT NULL,
    name character varying,
    price_criteria integer DEFAULT 0,
    start_date date,
    end_date date,
    max_num integer,
    code character varying
);


ALTER TABLE public.shipping_coupon OWNER TO postgres;

--
-- Name: shipping_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipping_coupon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shipping_coupon_id_seq OWNER TO postgres;

--
-- Name: shipping_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipping_coupon_id_seq OWNED BY public.shipping_coupon.id;


--
-- Name: used_discount_coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.used_discount_coupon (
    id integer NOT NULL,
    coupon_id integer NOT NULL,
    order_id integer NOT NULL
);


ALTER TABLE public.used_discount_coupon OWNER TO postgres;

--
-- Name: used_discount_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.used_discount_coupon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.used_discount_coupon_id_seq OWNER TO postgres;

--
-- Name: used_discount_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.used_discount_coupon_id_seq OWNED BY public.used_discount_coupon.id;


--
-- Name: used_shipping_coupon; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.used_shipping_coupon (
    id integer NOT NULL,
    coupon_id integer NOT NULL,
    order_id integer NOT NULL
);


ALTER TABLE public.used_shipping_coupon OWNER TO postgres;

--
-- Name: used_shipping_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.used_shipping_coupon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.used_shipping_coupon_id_seq OWNER TO postgres;

--
-- Name: used_shipping_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.used_shipping_coupon_id_seq OWNED BY public.used_shipping_coupon.id;


--
-- Name: discount_coupon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_coupon ALTER COLUMN id SET DEFAULT nextval('public.discount_coupon_id_seq'::regclass);


--
-- Name: member id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member ALTER COLUMN id SET DEFAULT nextval('public.member_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: purchase_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_item ALTER COLUMN id SET DEFAULT nextval('public.purchase_item_id_seq'::regclass);


--
-- Name: review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review ALTER COLUMN id SET DEFAULT nextval('public.review_id_seq'::regclass);


--
-- Name: shipping_address id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_address ALTER COLUMN id SET DEFAULT nextval('public.address_id_seq'::regclass);


--
-- Name: shipping_coupon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_coupon ALTER COLUMN id SET DEFAULT nextval('public.shipping_coupon_id_seq'::regclass);


--
-- Name: used_discount_coupon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.used_discount_coupon ALTER COLUMN id SET DEFAULT nextval('public.used_discount_coupon_id_seq'::regclass);


--
-- Name: used_shipping_coupon id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.used_shipping_coupon ALTER COLUMN id SET DEFAULT nextval('public.used_shipping_coupon_id_seq'::regclass);


--
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_item (user_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: discount_coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discount_coupon (id, price_criteria, discount_num, name, start_date, end_date, max_num, code) FROM stdin;
4	50000	1000	聖誕折扣	2022-12-18	2023-01-22	500	MERRY2022
5	3000	200	跨年折扣	2022-12-30	2023-01-15	100	NEW2023
9	1000	100	年初折扣	2023-01-04	2023-01-24	300	FIRST100
10	10000	200	寒假快樂	2023-01-10	2023-01-31	50	WINTER
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.member (id, email, name, password, isadmin) FROM stdin;
2	test	test	test	1
4	test3	test3	test3	0
6	test4@example.com	test4	$2a$10$e51L5HxetBH4MxVg6BZrEe.hcJXMn/535oZp4RT8eCNwsts0vnb7K	0
15	test5@example.com	test5	$2a$10$wrQ.FASLWquQXHrENIIhU.nHBh4PqyvvczLN66BAqvwn9oclzNH72	0
16	test6@example.com	test6	$2a$10$SDGgdrIY9/iPcbmjwyjQ6OG40whgJsVPh8BGDSw8t5OA4CJaFg5Ui	0
17	test7@example.com	test7	$2a$10$uN07JsrDhx1lmbJuOZvZrO8EZOBsUgs0g.9VhiCvjeUbJ8iUm6ijq	0
22	test8@example.com	test8	$2a$10$SB4Z6kWV1Rry63a3TxiE2uqB.VKeUChN8aluZOvBJU6Z4qYk4Qwe.	0
24	test10@example.com	test10	$2a$10$1QrwO9zoteely1eqSoRgf.oSU9UVxUyU/b7xZaIX3AN.piOuNOq8y	1
1	voho0000@gmail.com	YH	12345678	1
23	test9@example.com	test9	$2a$10$r.s0cy96.GcwlbGuF9hpUeP6sC61X8/w2q4v2IX9wC0trFcfQan6a	1
3	admin@example.com	Basir	$2a$10$wmcj08UwIHiVE5I2Lu/aauGXzQlNBNZsCWuasuN/HbJpjWJFeY06C	1
25	YHK@example.com	YHK	$2a$08$dGKk.4Pd4AAYGWymM3gKx.JGjf0EV64zwaHcuNe0HR9eDxiP9J1DS	1
26	cus1@example.com	客人1	$2a$10$9.V2TvalayA3JUB7L3WSR.x9pCo9qxcYjOP7C9hvJPjitH2jY6SkG	1
27	customer@gmail.com	你現在是管理員了	$2a$10$nCGJvgS4WykpMydHWug2MeQrsIzYKn9xeD9BvyYKwnsMWgLBQvTlm	1
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, create_time, items_price, shipping_price, discount_price, total_price, iscoupon, ispaid, payment_method, paid_time, isdelivered, delivered_time) FROM stdin;
3	22	2022-12-29 19:24:06.255534	34880	0	0	34880	f	f	PayPal	\N	f	\N
4	22	2022-12-29 21:04:59.865569	34880	0	0	34880	f	f	PayPal	\N	f	\N
5	22	2022-12-29 21:07:03.895648	34880	0	0	34880	f	f	PayPal	\N	f	\N
7	22	2022-12-29 22:58:31.677844	29890	0	0	29890	f	f	PayPal	\N	f	\N
8	22	2022-12-29 22:58:52.985382	29890	0	0	29890	f	f	PayPal	\N	f	\N
9	22	2022-12-29 23:07:16.174016	29890	0	0	29890	f	f	PayPal	\N	f	\N
14	24	2022-12-30 02:14:41.137638	102900	0	0	102900	f	f	Stripe	\N	f	\N
15	24	2022-12-30 02:15:12.376641	102900	0	0	102900	f	t	Stripe	2022-12-30 13:56:33.47352	f	\N
13	24	2022-12-30 01:24:08.816613	23110	0	0	23110	f	t	PayPal	2022-12-30 13:58:02.257259	f	\N
12	23	2022-12-30 00:53:55.223352	18610	0	0	18610	f	t	Stripe	2022-12-30 13:59:22.152612	f	\N
10	22	2022-12-29 23:22:24.493151	26720	0	0	26720	f	t	Stripe	2022-12-30 14:26:08.697817	f	\N
11	22	2022-12-30 00:50:16.419919	34210	0	0	34210	f	t	PayPal	2022-12-30 14:30:46.815816	f	\N
16	24	2022-12-30 14:33:57.83079	58240	0	0	58240	f	t	PayPal	2022-12-30 14:33:58.943344	t	2023-01-01 21:25:54.143338
17	25	2023-01-03 15:50:37.521394	105800	0	0	105800	f	t	Credit Card	2023-01-03 16:13:06.91313	f	\N
18	25	2023-01-03 17:02:59.115059	54000	0	0	54000	f	t	Credit Card	2023-01-03 17:03:13.045782	f	\N
19	26	2023-01-07 03:25:58.420864	26450	100	100	26450	f	t	Credit Card	2023-01-07 03:37:37.535298	t	2023-01-07 03:38:07.199973
20	25	2023-01-07 03:43:15.04073	24900	100	100	24900	f	t	Credit Card	2023-01-07 03:43:24.534026	t	2023-01-07 03:44:47.723259
21	25	2023-01-07 19:44:36.172296	15000	0	0	15000	f	f	Credit Card	\N	f	\N
22	25	2023-01-08 00:00:17.852487	51900	0	0	51900	f	f	Credit Card	\N	f	\N
23	27	2023-01-08 02:12:58.980438	18900	0	100	18800	f	t	Credit Card	2023-01-08 02:13:04.612728	t	2023-01-08 02:15:54.79587
24	25	2023-01-10 16:58:23.016653	24900	100	100	24900	f	t	Credit Card	2023-01-10 17:03:18.570041	f	\N
25	27	2023-01-10 22:09:16.689147	28000	0	100	27900	f	f	Credit Card	\N	f	\N
26	27	2023-01-11 16:29:39.265342	12490	0	100	12390	f	t	Credit Card	2023-01-11 16:36:13.934993	t	2023-01-11 16:37:29.274955
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, category, description, price, image_url, created_time, discontinue_date, countinstock, rating, num_reviews, featured, brand) FROM stdin;
2	Google Pixel 7 Pro	Phone	Google Pixel 7 Pro is Google’s best-of-everything phone; powered by Google Tensor G2, it’s faster, more efficient, and more secure, with the best photo and video quality yet on Pixel.	27000	/images/Google-Pixel-7-Pro.jpg	2022-12-07 13:37:44.7364	\N	10	4	10	1	Google
3	Asus Zenfone 9	Phone	Supported Network Bands: 5G/4G/3G/2G. Please note that 5G requires the support of local telecom operator services and may not be available in all regions. Please check with your service provider to see if 5G is offered in your area.	24900	/images/Asus-Zenfone-9.jpg	2022-12-07 13:47:23.228692	\N	10	5	8	0	ASUS
4	SAMSUNG Galaxy S22 Ultra	Phone	8K SUPER STEADY VIDEO: Shoot videos that rival how epic your life is with stunning 8K recording, the highest recording resolution available on a smartphone; Video captured is effortlessly smooth, thanks to Auto Focus Video Stabilization on Galaxy S22 Ultra.Form_factor : Smartphone.	30240	/images/SAMSUNG-Galaxy-S22-Ultra.jpg	2022-12-07 13:47:23.228692	\N	10	3	5	0	SAMSUNG
5	Xperia 1 III	Phone	World’s first smartphone with 120Hz 6.5” 4K HDR OLED display.Form_factor : Slate.Aspect ratio:21:9.Display resolution maximum:1644 x 3840 pixels.	24000	/images/Xperia-1-III.jpg	2022-12-07 13:47:23.228692	\N	10	3	5	1	Sony
8	Microsoft Surface Pro 9	Laptop	Built on the Intel Evo platform with 12th Gen Intel Core processors	42000	/images/Microsoft-Surface-Pro-9.jpg	2022-12-07 13:47:23.228692	\N	10	3	7	1	Microsoft
15	Marshall Major IV	Headphone	Major IV delivers the signature Marshall sound that you’ve come to expect. Custom-tuned dynamic drivers deliver roaring bass, smooth mids and brilliant treble for a rich, unrivalled sound that you’ll never want to turn off	4990	/images/Marshall-Major-IV.jpeg	2022-12-07 13:47:23.228692	\N	10	4	7	1	Marshall
1	iPhone 13 Pro	Phone	A like-new experience. Backed by a one-year satisfaction guarantee.	24900	/images/iPhone-13-Pro.jpg	2022-12-07 13:37:44.7364	\N	10	5	6	0	Apple
7	2020 Apple MacBook Air M1	Laptop	Powerful Performance – Take on everything from professional-quality editing to action-packed gaming with ease. The Apple M1 chip with an 8-core CPU delivers up to 3.5x faster performance than the previous generation while using way less power	28000	/images/2020-Apple-MacBook-Air-M1.jpg	2022-12-07 13:47:23.228692	\N	10	3	5	1	Apple
9	ASUS VivoBook 15.6	Laptop	15.6 Full HD touch screen for hands-on control】Natural finger-touch navigation makes the most of Windows 11 Home. The 1920 x 1080 resolution boasts impressive color and clarity with Wide Viewing angles display	18900	/images/ASUS-VivoBook-15.6.jpg	2022-12-07 13:47:23.228692	\N	10	4	7	0	ASUS
11	AirPods Pro 2nd generation	Headphone	AirPods Pro (2nd generation) have been reengineered to deliver up to 2x more Active Noise Cancellation. Adaptive Transparency reduces external noise, while Personalized Spatial Audio immerses you in sound. A single charge delivers up to 6 hours of battery life.	7500	/images/AirPods-Pro-2nd-generation.jpeg	2022-12-07 13:47:23.228692	\N	10	5	2	0	Apple
6	Acer Aspire 5 A515-56-32DK	Laptop	Powerful Productivity: 11th Generation Intel Core i3-1115G4 Dual Core processor delivers unmatched speed and intelligence, enabling impressive creating, productivity, and gaming experiences. With Turbo Boost Technology, get up to 4.1GHz for your high-demand applications.Connectivity Technology: Wi-Fi, Bluetooth, HDMI	8110	/images/Acer-Aspire-5-A515-56-32DK.jpg	2022-12-07 13:47:23.228692	\N	10	3	4	0	Acer
10	HP 2022 New 15 Laptop, 15.6	Laptop	Storage & RAM: RAM is 16 GB high-bandwidth RAM to smoothly run multiple applications and browser tabs all at once; Hard Drive is 1 TB Solid State Drive to allow faster bootup and data transfer.	8110	/images/HP-2022-New-15-Laptop,-15.6.jpg	2022-12-07 13:47:23.228692	\N	10	4	18	1	HP
12	Sony WH-1000XM5	Headphone	Industry Leading noise cancellation-two processors control 8 microphones for unprecedented noise cancellation. With Auto NC Optimizer, noise canceling is automatically optimized based on your wearing conditions and environment.	10500	/images/Sony-WH-1000XM5.jpg	2022-12-07 13:47:23.228692	\N	10	4	15	1	Sony
13	Bose QuietComfort 45	Headphone	Noise cancelling wireless headphones – The perfect balance of quiet, comfort, and sound. Bose uses tiny mics to measure, compare, and react to outside noise, cancelling it with opposite signals. Bluetooth range-up to 9 m (30 feet). Compatible App-Bose Music app	6210	/images/Bose-QuietComfort-45.jpg	2022-12-07 13:47:23.228692	\N	10	1	2	0	Bose
14	JBL Tune 510BT	Headphone	The Tune 510BT wireless headphones feature renowned JBL Pure Bass sound, which can be found in the most famous venues all around the world.	1550	/images/JBL-Tune-510BT.jpg	2022-12-07 13:47:23.228692	\N	10	4	19	1	JBT
26	ipad-pro-11-m2-2022	Tablet	Ipad pro 11 itches with m2 chip	27900	/images/ipad-pro-11-m2-2022.jpeg	2023-01-01 01:20:45.707112	\N	10	0	0	\N	Apple
36	ipad-10gen	Tablet	ipad	14990	/images/ipad-10th-gen.jpeg	2023-01-11 17:02:53.690283	\N	10	0	0	\N	Apple
\.


--
-- Data for Name: purchase_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_item (id, order_id, product_id, name, quantity, price, image_url) FROM stdin;
1	3	1	iPhone 13 Pro	1	24900	\N
2	3	15	Marshall Major IV	2	4990	\N
3	4	1	iPhone 13 Pro	1	24900	\N
4	4	15	Marshall Major IV	2	4990	\N
5	5	1	iPhone 13 Pro	1	24900	\N
6	5	15	Marshall Major IV	2	4990	\N
7	7	1	iPhone 13 Pro	1	24900	\N
8	7	15	Marshall Major IV	1	4990	\N
9	8	1	iPhone 13 Pro	1	24900	\N
10	8	15	Marshall Major IV	1	4990	\N
11	9	1	iPhone 13 Pro	1	24900	\N
12	9	15	Marshall Major IV	1	4990	\N
13	10	10	HP 2022 New 15 Laptop, 15.6	2	8110	\N
14	10	12	Sony WH-1000XM5	1	10500	\N
15	11	7	2020 Apple MacBook Air M1	1	28000	\N
16	11	13	Bose QuietComfort 45	1	6210	\N
17	12	10	HP 2022 New 15 Laptop, 15.6	1	8110	\N
18	12	12	Sony WH-1000XM5	1	10500	\N
19	13	11	AirPods Pro 2nd generation	2	7500	\N
20	13	6	Acer Aspire 5 A515-56-32DK	1	8110	\N
21	15	9	ASUS VivoBook 15.6	1	18900	/images/ASUS-VivoBook-15.6.jpg
22	15	8	Microsoft Surface Pro 9	2	42000	/images/Microsoft-Surface-Pro-9.jpg
23	16	4	SAMSUNG Galaxy S22 Ultra	1	30240	/images/SAMSUNG-Galaxy-S22-Ultra.jpg
24	16	7	2020 Apple MacBook Air M1	1	28000	/images/2020-Apple-MacBook-Air-M1.jpg
25	17	3	Asus Zenfone 9	1	24900	/images/Asus-Zenfone-9.jpg
26	17	7	2020 Apple MacBook Air M1	2	28000	/images/2020-Apple-MacBook-Air-M1.jpg
27	17	1	iPhone 13 Pro	1	24900	/images/iPhone-13-Pro.jpg
28	18	2	Google Pixel 7 Pro	2	27000	/images/Google-Pixel-7-Pro.jpg
29	19	14	JBL Tune 510BT	1	1550	/images/JBL-Tune-510BT.jpg
30	19	1	iPhone 13 Pro	1	24900	/images/iPhone-13-Pro.jpg
31	20	3	Asus Zenfone 9	1	24900	/images/Asus-Zenfone-9.jpg
32	21	11	AirPods Pro 2nd generation	2	7500	/images/AirPods-Pro-2nd-generation.jpeg
33	22	1	iPhone 13 Pro	1	24900	/images/iPhone-13-Pro.jpg
34	22	2	Google Pixel 7 Pro	1	27000	/images/Google-Pixel-7-Pro.jpg
35	23	9	ASUS VivoBook 15.6	1	18900	/images/ASUS-VivoBook-15.6.jpg
36	24	1	iPhone 13 Pro	1	24900	/images/iPhone-13-Pro.jpg
37	25	7	2020 Apple MacBook Air M1	1	28000	/images/2020-Apple-MacBook-Air-M1.jpg
38	26	11	AirPods Pro 2nd generation	1	7500	/images/AirPods-Pro-2nd-generation.jpeg
39	26	15	Marshall Major IV	1	4990	/images/Marshall-Major-IV.jpeg
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (id, product_id, user_id, review_date, rating, comment, image_url) FROM stdin;
1	1	3	2023-01-02 01:43:38.872309	5	Good product	\N
2	1	3	2023-01-02 01:46:39.600948	5	Excellent product.	\N
3	1	3	2023-01-02 01:47:59.612757	5	good	\N
4	1	3	2023-01-02 03:19:06.954486	4	I really like it	\N
5	1	25	2023-01-03 16:16:27.480659	5	棒	\N
6	1	27	2023-01-08 02:15:23.392623	3	不要再擠牙膏了	\N
7	11	25	2023-01-11 16:14:42.604836	5	令人驚豔的降噪效果	\N
8	11	27	2023-01-11 16:36:58.626961	5	電量變大了！	\N
\.


--
-- Data for Name: shipping_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_address (id, order_id, fullname, phone, address, city, postal_code, country) FROM stdin;
2	4	Kuo	912345678	one road	Taipei	111	Taiwan
3	5	Kuo	912345678	one road	Taipei	111	Taiwan
4	7	Kuo	912345678	one road	Taipei	111	Taiwan
5	8	Kuo	912345678	one road	Taipei	111	Taiwan
6	9	Kuo	912345678	one road	Taipei	111	Taiwan
7	10	Kuo	911111111	Two road	Taichong	333	Taiwan
8	11	Kuo	922222222	Three road	AAA	444	Taiwan
9	12	Kuo	911223344	Three road	yes city	222	Taiwan
10	13	Kuo	933221144	no road	A city	999	Taiwan
11	15	Lee	912344321	No road	Yes city	222	Taiwan
12	16	Lee	912344321	No road	Yes city	222	Taiwan
13	17	Lee	912344321	No road	Yes city	222	Taiwan
14	18	Lee	912344321	No road	Yes city	222	Taiwan
1	3	Kuo	912345678	one road	Taipei	111	Taiwan
15	19	Lee	912344321	No road	Yes city	222	Taiwan
16	20	Lee	912344321	No road	Yes city	222	Taiwan
17	21	Lee	912344321	No road	Yes city	222	Taiwan
18	22	Lee	912344321	No road	Yes city	222	Taiwan
19	23	Lee	912344321	No road	Yes city	222	Taiwan
20	24	Lee	912344321	No road	Yes city	222	Taiwan
21	25	Lee	912344321	No road	Yes city	222	Taiwan
22	26	Lee	912344321	No road	Yes city	222	Taiwan
\.


--
-- Data for Name: shipping_coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_coupon (id, name, price_criteria, start_date, end_date, max_num, code) FROM stdin;
2	新年免運	10000	2023-01-01	2023-01-30	100	NEW2023
3	聖誕免運	5000	2022-12-18	2022-12-31	100	MERRYFREE
\.


--
-- Data for Name: used_discount_coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.used_discount_coupon (id, coupon_id, order_id) FROM stdin;
\.


--
-- Data for Name: used_shipping_coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.used_shipping_coupon (id, coupon_id, order_id) FROM stdin;
\.


--
-- Name: address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_id_seq', 22, true);


--
-- Name: discount_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_coupon_id_seq', 10, true);


--
-- Name: member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.member_id_seq', 27, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 26, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 36, true);


--
-- Name: purchase_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_item_id_seq', 39, true);


--
-- Name: review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_id_seq', 8, true);


--
-- Name: shipping_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipping_coupon_id_seq', 3, true);


--
-- Name: used_discount_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.used_discount_coupon_id_seq', 1, false);


--
-- Name: used_shipping_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.used_shipping_coupon_id_seq', 1, false);


--
-- Name: shipping_address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- Name: discount_coupon discount_coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_coupon
    ADD CONSTRAINT discount_coupon_pkey PRIMARY KEY (id);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: purchase_item purchase_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_item
    ADD CONSTRAINT purchase_item_pkey PRIMARY KEY (id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: shipping_coupon shipping_coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_coupon
    ADD CONSTRAINT shipping_coupon_pkey PRIMARY KEY (id);


--
-- Name: used_discount_coupon used_discount_coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.used_discount_coupon
    ADD CONSTRAINT used_discount_coupon_pkey PRIMARY KEY (id);


--
-- Name: used_shipping_coupon used_shipping_coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.used_shipping_coupon
    ADD CONSTRAINT used_shipping_coupon_pkey PRIMARY KEY (id);


--
-- Name: cart_item cart_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_item cart_item_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: purchase_item purchase_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_item
    ADD CONSTRAINT purchase_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review review_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.member(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: used_discount_coupon used_discount_coupon_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.used_discount_coupon
    ADD CONSTRAINT used_discount_coupon_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.discount_coupon(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

