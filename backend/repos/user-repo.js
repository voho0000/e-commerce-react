import pool from '../pool.js'

export default class UserRepo {
    static async findByEmail(email) {
        try {
            const userEmail = email
            const { rows } = await pool.query("SELECT * FROM member WHERE email = $1;", [userEmail]);
            return rows
        } catch(err){
            console.log(err)
        }
    }
}
