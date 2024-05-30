const db = require("../db/connection");
const {
  checkArticleExists,
} = require("../error-handlers/check-article-exists");
const { checkIsNumber } = require("../error-handlers/check-is-number");
const { checkIsUser } = require("../error-handlers/check-is-user");
const { checkExists } = require('../error-handlers/check-exists')

exports.fetchArticleComments = async (articleId) => {
  try {
    const promises = [
      checkArticleExists(articleId), 
      checkIsNumber(articleId)
    ];

    const results = await Promise.all(promises);

    const queryString = `SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`;

    const queryParams = [articleId];
    const { rows } = await db.query(queryString, queryParams);

    const response = {
      comments: rows,
    };

    return response;
  } catch (error) {
    throw error;
  }
};

exports.handleComment = async (username, article_id, body) => {
  try {
    const promises = [
      checkIsUser(username),
      checkArticleExists(article_id),
      checkIsNumber(article_id),
    ];

    const promiseResults = await Promise.all(promises);

    const queryString = `INSERT INTO comments
        (body, article_id, author)
        VALUES ($1, $2, $3)
        RETURNING *;`;
    const queryParams = [body, article_id, username];

    const { rows } = await db.query(queryString, queryParams);

    return rows[0];
  } catch (error) {
    throw error;
  }
};

exports.handleCommentDelete = async (commentId) => {
  const errorHandlingPromises = [
    checkExists('comment', commentId),
    checkIsNumber(commentId)
  ]

  const errorHandlingResults = await Promise.all(errorHandlingPromises)

  const queryString = `DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;`
  const queryParams = [commentId]

  const { rows } = await db.query(queryString, queryParams)

  if (rows[0].length !== 0) {
    return Promise.resolve({
      status: 204
    })
  }

  return Promise.reject({
    status: 500,
    msg: 'Unknown issue'
  })
}
