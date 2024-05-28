const db = require("../db/connection");

exports.fetchArticleById = async (articleId) => {
  try {
    const queryParams = [articleId];
    const queryString = `SELECT * from articles
        WHERE article_id = $1;`;

    const {rows} = await db.query(queryString, queryParams);

    return rows;
  } catch (error) {
    throw error;
  }
};
