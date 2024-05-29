const db = require("../db/connection");

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
