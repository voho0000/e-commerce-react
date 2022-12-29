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

    static async createUser(user) {
        try {
            await pool.query(`INSERT INTO member(email, name, password, isAdmin, token) 
                            VALUES($1, $2, $3, $4, $5);`,
                            [user.email, user.name, user.password, user.isadmin, user.token]);

            var {rows} =  await pool.query("SELECT currval('member_id_seq')");
            const id = parseInt(rows[0].currval)
            var {rows} = await pool.query("SELECT * from member where id = $1;", [id]);
            return rows
        } catch (err) {
            console.log(err)
        }  
    }

    static async updateUserToken(createdUser) {
        try {
            await pool.query(`UPDATE member SET token = $1 WHERE id = $2;`,
                            [createdUser.token, createdUser.id]);
            var {rows} = await pool.query("SELECT * from member where id = $1;", [createdUser.id]);
            return rows
        } catch (err) {
            console.log(err)
        }         
    }
}
