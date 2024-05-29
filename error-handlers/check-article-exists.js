const db = require('../db/connection');

exports.checkArticleExists = async (articleId) => {
    const queryString = `SELECT * FROM articles
    WHERE article_id = $1`
    const queryParams = [articleId]

    const queryResults = await db.query(queryString, queryParams)
    
    if (queryResults.rowCount === 0) {
        return Promise.reject({
            status: 404,
            msg: 'Article not found'
        })
    }

    return Promise.resolve(true)
}