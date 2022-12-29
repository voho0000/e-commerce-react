import { query } from 'express';
import pool from '../pool.js'

export default class OrderRepo {
    static async createOrder(userID, orderInfo) {
        try {
            const orderItems = orderInfo.orderItems
            const orderAddress = orderInfo.shippingAddress
            await pool.query(`INSERT INTO orders (user_id, create_time, items_price, shipping_price, discount_price, total_price, payment_method)
             VALUES ($1, current_timestamp, $2, $3, $4, $5, $6)`,
                    [userID, orderInfo.itemsPrice, orderInfo.shippingPrice, 
                        orderInfo.discountPrice, orderInfo.totalPrice, orderInfo.paymentMethod]);
            var {rows} =  await pool.query(`SELECT * FROM orders 
                                            WHERE user_id = $1 AND 
                                            id = (SELECT MAX(id) FROM orders WHERE user_id = $1);`,[userID]);
            const order = rows[0]
            const orderId = order.id

            await orderItems.map((x)=>pool.query(`INSERT INTO purchase_item(order_id, product_id, name, quantity, price) 
            VALUES($1, $2, $3, $4, $5)`, [orderId, x.id, x.name, x.quantity, x.price]))
            await pool.query(`INSERT INTO Address(order_id, fullname, phone, address, city, postal_code, country) 
            VALUES($1, $2, $3, $4, $5, $6, $7)`, [orderId, orderAddress.fullName, orderAddress.phone, 
                orderAddress.address, orderAddress.city, orderAddress.postalCode, orderAddress.country])
            
            return order
        } catch (err) {
            console.log(err)
        }  
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

