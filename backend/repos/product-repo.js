import pool from '../pool.js'

export default class ProductRepo {
    static async getProducts() {
        try {
            const { rows } = await pool.query('SELECT * FROM product;');
            return rows
        } catch (err) {
            console.log(err)
        }
    }

    static async getCategories() {
        try {
            const { rows } = await pool.query('SELECT distinct(category) FROM product;');
            console.log(rows)
            let categories = rows.map(({ category }) => category)
            return categories
        } catch (err) {
            console.log(err)
        }
    }
    

    static async findById(id) {
        try {
            const data = await pool.query('SELECT * FROM product WHERE id = $1;',[id]);
            return data
        } catch (err) {
            console.log(err)
        }


    }
}



