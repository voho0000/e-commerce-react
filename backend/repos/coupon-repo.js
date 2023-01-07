import { query } from 'express';
import pool from '../pool.js'


export default class CouponRepo {
    static async findDiscountAll() {
        try {
            const { rows } = await pool.query(`
            SELECT * FROM discount_coupon order by id asc;
            `)
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async countCouponAll() {
        try {
            var { rows } = await pool.query(`SELECT count(*) from discount_coupon; `)
            rows = Number(rows[0].count)
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async createDiscountCoupon(c) {
        try {
            await pool.query(`
            INSERT INTO discount_coupon (name, start_date, end_date, price_criteria,
                discount_num, max_num, code) 
                    VALUES($1, $2, $3, $4, $5, $6, $7);`,
                [c.name, c.start_date, c.end_date, c.price_criteria, c.discount_num, c.max_num, c.code]);
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteDiscountCoupon(couponId) {
        await pool.query(
            `DELETE FROM discount_coupon WHERE id = $1;`,
                [couponId])
    }

    static async findDiscountCode(code) {
        try {
            var {rows} = 
            await pool.query(`
            SELECT * FROM discount_coupon WHERE code = $1;
            `,[code])
            rows = rows[0]
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async findShippingCode(code) {
        try {
            var {rows} = 
            await pool.query(`
            SELECT * FROM shipping_coupon WHERE code = $1;
            `,[code])
            rows = rows[0]
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async findShippingAll() {
        try {
            const { rows } = await pool.query(`
            SELECT * FROM shipping_coupon order by id asc;
            `)
            
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async createShippingCoupon(c) {
        try {
            await pool.query(`
            INSERT INTO shipping_coupon (name, start_date, end_date, price_criteria,
                 max_num, code) 
                    VALUES($1, $2, $3, $4, $5, $6);`,
                [c.name, c.start_date, c.end_date, c.price_criteria, c.max_num, c.code]);
        } catch (err) {
            console.log(err)
        }
    }

    static async deleteShippingCoupon(couponId) {
        await pool.query(
            `DELETE FROM shipping_coupon WHERE id = $1;`,
                [couponId])
    }
}