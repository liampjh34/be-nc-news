const db = require("../db/connection");

exports.fetchArticles = async () => {
  try {
    const query = `SELECT 
        articles.author,
        articles.title,
        articles.article_id,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        CAST(COUNT(comments.body) AS INT) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `
    const results = await db.query(query)
    return results.rows
  } catch (error) {
    throw error
  }
}

exports.fetchArticleById = async (articleId) => {
  try {
    const queryParams = [articleId];
    const queryString = `SELECT * from articles
        WHERE article_id = $1;`;

    const {rows} = await db.query(queryString, queryParams);

    if (rows.length === 0 ) {
      return Promise.reject({
        status: 404,
        msg: 'No results found'
      })
    } else {
      return rows[0];
    }
  } catch (error) {
    throw error
  }
};
