import { query } from 'express';
import pool from '../pool.js'


export default class CartRepo {
    static async findByUser(userId) {
        try {
            var {rows} = await pool.query(`
            SELECT * FROM cart_item WHERE user_id = $1;
            `,[userId])
            const cart = rows;
            var cartItems=[];
            if (cart){
                for (var i=0; i < cart.length; i++){
                    var {rows} = await pool.query(`
                        select * from product where id = $1`,
                        [cart[i].product_id]);
                    var product = rows[0]
                    product.quantity = cart[i].quantity
                    cartItems.push(product)
                }
            }
            return cartItems
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteByUser(userId) {
        try{
        await pool.query(
            `DELETE FROM cart_item WHERE user_id = $1;`,
                [userId])
        } catch (err){
            console.log(err)
        }
    }

    static async updateByUser(userId, cartItem) {
        try{
            // to prevent duplicate, first delete item and then insert into
        await pool.query(
            `INSERT INTO cart_item(product_id, quantity, user_id)
                VALUES($1, $2, $3)`,
                [cartItem.id, cartItem.quantity, userId]
        )
        } catch (err){
            console.log(err)
        }
    }
};