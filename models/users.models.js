const db = require('../db/connection');

exports.fetchUsers = async () => {
    try{
        const { rows } = await db.query(`SELECT * FROM users;`)
        return {
            users: rows
        }
    } catch(error) {
        throw error
    }
}