import pool from '../pool.js'

export default class ReviewRepo {
    static async createReview(review) {
        try {
            await pool.query(`INSERT INTO review (product_id, user_id, review_date, rating, comment)
             VALUES ($1, $2, current_timestamp, $3, $4);`,
                [review.product_id, review.user_id, review.rating, review.comment]);
        } catch (err) {
            console.log(err)
        }
    }

    static async findAll(productId) {
        try {
            const { rows } = await pool.query(`
            SELECT review.*, name 
                FROM review 
                JOIN member on review.user_id = member.id 
                WHERE product_id = $1  
                ORDER BY review_date DESC;`,
                    [productId]);

            return rows
        } catch (err) {
            console.log(err)
        }
    }
}
