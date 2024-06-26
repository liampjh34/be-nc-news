const db = require('../db/connection');

exports.checkIsUser = async (username) => {
    const queryString = `SELECT * FROM users
    WHERE username = $1;`
    const queryParams = [username]

    const { rows } = await db.query(queryString, queryParams)

    if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: "No user found"
        })
    }

    return Promise.resolve(true)
}