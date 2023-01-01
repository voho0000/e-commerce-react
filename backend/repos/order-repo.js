import { query } from 'express';
import pool from '../pool.js'

export default class OrderRepo {
    static async createOrder(userId, orderInfo) {
        try {
            const orderItems = orderInfo.orderItems
            const orderAddress = orderInfo.shipping_address
            // insert order infomation
            await pool.query(`INSERT INTO orders (user_id, create_time, items_price, shipping_price, discount_price, total_price, payment_method)
             VALUES ($1, current_timestamp, $2, $3, $4, $5, $6)`,
                [userId, orderInfo.items_price, orderInfo.shipping_price,
                    orderInfo.discount_price, orderInfo.total_price, orderInfo.payment_method]);
            // get current order id
            var { rows } = await pool.query(`SELECT * FROM orders 
                                            WHERE user_id = $1 AND 
                                            id = (SELECT MAX(id) FROM orders WHERE user_id = $1);`, [userId]);
            var order = rows[0]
            const orderId = order.id

            // insert purchase_item
            await orderItems.map((x) => pool.query(`INSERT INTO purchase_item(order_id, product_id, name, quantity, price, image_url) 
            VALUES($1, $2, $3, $4, $5, $6)`, [orderId, x.id, x.name, x.quantity, x.price, x.image_url]))

            // insert address information
            await pool.query(`INSERT INTO shipping_address(order_id, fullname, phone, address, city, postal_code, country) 
            VALUES($1, $2, $3, $4, $5, $6, $7)`, [orderId, orderAddress.fullname, orderAddress.phone,
                orderAddress.address, orderAddress.city, orderAddress.postal_code, orderAddress.country])

            return order
        } catch (err) {
            console.log(err)
        }
    }

    static async findByUser(userId) {
        try {
            var { rows } = await pool.query(`SELECT * FROM orders WHERE user_id = $1;`, [userId]);
            /*
            var { rows } = await pool.query(`SELECT * FROM purchase_item WHERE order_id = $1;`, [orderId]);
            order.orderItems = rows
            var { rows } = await pool.query(`SELECT * FROM shipping_address WHERE order_id = $1;`, [orderId]);
            rows = rows[0]
            order.shipping_address = rows
            
            */
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async findById(orderId) {
        try {
            var { rows } = await pool.query(`SELECT * FROM orders WHERE id = $1;`, [orderId]);
            var order = rows[0];
            var { rows } = await pool.query(`SELECT * FROM purchase_item WHERE order_id = $1;`, [orderId]);
            order.orderItems = rows
            var { rows } = await pool.query(`SELECT * FROM shipping_address WHERE order_id = $1;`, [orderId]);
            rows = rows[0]
            order.shipping_address = rows
            return order
        } catch (err) {
            console.log(err)
        }
    }

    static async updateOrderPay(order) {
        await pool.query(`UPDATE orders SET ispaid = $1, paid_time=current_timestamp WHERE id = $2;`,
            [order.ispaid, order.id]);
        var { rows } = await pool.query("SELECT * from orders where id = $1;", [order.id]);
        var newOrder = rows[0];
        var { rows } = await pool.query(`SELECT * FROM purchase_item WHERE order_id = $1;`, [order.id]);
        newOrder.orderItems = rows
        var { rows } = await pool.query(`SELECT * FROM shipping_address WHERE order_id = $1;`, [order.id]);
        rows = rows[0]
        newOrder.shipping_address = rows
        return newOrder
    }

    static async countOrderNum() {
        try {
            var { rows } = await pool.query(`SELECT COUNT(*) as num_orders, SUM(total_price) as total_sales
            FROM orders;`)
            rows = rows[0]
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async countDailyOrderNum() {
        try {
            const { rows } = await pool.query(`SELECT
            to_char(date_trunc('day', create_time), 'YYYY-MM-DD') as date,
            COUNT(*) as orders,
            SUM(total_price) as sales
                FROM orders
                GROUP BY date
                ORDER BY date ASC;`)
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async listOrder() {
        try {
            var { rows } = await pool.query(
                `SELECT orders.*, member.name
                    FROM orders
                        JOIN member ON orders.user_id = member.id;`);
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteOrder(orderId) {
        await pool.query(
            `DELETE FROM orders WHERE id = $1;`,
                [orderId])
    }
}
/*
'select id from orders where $1 = max($1)',[userID]

orderItems.map((x)=>)

var {rows} =  await pool.query("SELECT currval('orders_id_seq')");
const orderId = parseInt(rows[0].currval);

order = 

query(`INSERT INTO purchase_item(order_id, product_id, name, quantity, price) 
    VALUES($1, $2, $3, $4, $5)`, [orderId, x.id, x.name, x.quantity, x.price])

query(`INSERT INTO Address(order_id, fullname, phone, address, city, postal_code, country) 
    VALUES($1, $2, $3, $4, $5, $6, $7)`, [orderId, orderAddress.fullname, orderAddress.phone, 
        orderAddress.address, orderAddress.city, orderAddress.postalCode, orderAddress.country])

*/

