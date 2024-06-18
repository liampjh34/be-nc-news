const db = require('../db/connection')
const format = require('pg-format')

exports.checkVotes = async (desiredDecrement, articleId) => {
    try{
        const queryParams = [articleId]
        const { inc_votes } = desiredDecrement

        const query = format(`SELECT articles.article_id, articles.votes
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        HAVING articles.article_id = %s;`, queryParams)

        const { rows } = await db.query(query)
        const votes = rows[0].votes

        if ((votes + inc_votes) < 0) {
            return Promise.reject({
                status: 400,
                msg: 'Not allowed!'
            })
        }

        return Promise.resolve(true)

    } catch(error) {
        throw error
    }
};
