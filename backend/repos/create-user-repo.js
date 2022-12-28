import pool from '../pool.js'
import bcrypt from 'bcryptjs';


export default class CreateUserRepo {
    static async createUser(user) {
        try {
            pool.query(`INSERT INTO member(id, email, name, password, isAdmin, token) 
                            VALUES($1, $2, $3, $4, $5, $6);`,
                            [user.id, user.email, user.name, user.password, user.isAdmin, user.token])
            const { rows } = await pool.query("SELECT * FROM member where id=2;");
            return rows
        } catch (err) {
            console.log(err)
        }  
    }

    
}


