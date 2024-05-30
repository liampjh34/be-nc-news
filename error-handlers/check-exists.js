const db = require('../db/connection');
const format = require('pg-format')

exports.checkExists = async (type, id) => {
    const queryString = format(`SELECT * FROM %Is WHERE %I_id = %s;`, type, type, id)
    const queryResults = await db.query(queryString)
    const { rows } = queryResults
    
    if (queryResults.rowCount === 0) {
        return Promise.reject({
            status: 404,
            msg: `${type} not found`
        })
    }

    return Promise.resolve(true)
}