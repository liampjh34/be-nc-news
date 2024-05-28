const fs = require('fs/promises')
const db = require('../db/connection')

exports.fetchEndpoints = async () => {
    try {
        const endpoints = await fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
        const parsedEndpoints = JSON.parse(endpoints)
        return parsedEndpoints
    } catch(error) {
        next(error)
    }

}