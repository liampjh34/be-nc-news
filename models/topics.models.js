const db = require('../db/connection')

exports.fetchAllTopics = async () => {
    try {
        const { rows } = await db.query(`SELECT * FROM topics;`)
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: 'No results found'
            })
        } else {
            return rows
        }
    } catch(error) {
        next(error)
    }
}