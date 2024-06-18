const db = require("../db/connection");
const { checkArticleExists } = require("../error-handlers/check-article-exists");
const { checkIsNumber } = require("../error-handlers/check-is-number");
const { checkVotes } = require('../error-handlers/check-votes')
const { checkExists } = require('../error-handlers/check-exists')
const format = require('pg-format');
const { isValidSort } = require("../error-handlers/check-valid-sort");
const { isValidOrder } = require("../error-handlers/check-valid-order");

exports.fetchArticles = async (topic=undefined, desiredSort=undefined, desiredOrder='desc') => {
  try {
    const errorHandlingPromises = [
      isValidSort(desiredSort),
      isValidOrder(desiredOrder)
    ]

    await Promise.all(errorHandlingPromises)

    let query = `SELECT 
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    CAST(COUNT(comments.body) AS INT) AS comments
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id`

    if (!(topic === undefined)) {
      const whereClause = format(` WHERE articles.topic = '%s'`, topic)
      query += whereClause
    }

    query += ` GROUP BY articles.article_id`

    if (!(desiredSort === undefined)) {
      const sortByClause = desiredSort === 'comments' ? ` ORDER BY comments` : format(` ORDER BY articles.%s`, desiredSort)
      query += sortByClause
    } else {
      query += ` ORDER BY articles.created_at`
    }

    if (desiredOrder === undefined || desiredOrder === 'desc') {
      query += ` DESC`
    } else {
      query += ` ASC`
    }

    const { rows } = await db.query(query)
    return {
      articles: rows
    }
  } catch (error) {
    throw error
  }
}

exports.fetchArticleById = async (articleId) => {
  try {
    const errorHandlingPromises = [
      checkExists('article', articleId),
      checkIsNumber(articleId)
    ]

    const errorHandlingResults = await Promise.all(errorHandlingPromises)

    const queryParams = [articleId];
    const queryString = `SELECT articles.*,
      CAST(COUNT(comments.body) AS INT) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      HAVING articles.article_id = $1
      ORDER BY articles.created_at DESC;`;

    const {rows} = await db.query(queryString, queryParams);

    return {
      article: rows[0]
    }

  } catch (error) {
    throw error
  }
};

exports.updateArticle = async (articleId, voteChange) => {
  try{
    const errorHandlingPromises = [
      checkArticleExists(articleId),
      checkIsNumber(articleId),
      checkVotes(voteChange, articleId)
    ]
  
    const errorHandlingResults = await Promise.all(errorHandlingPromises)
  
    const queryString = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`
    const queryParams = [voteChange.inc_votes, articleId]
    const result = await db.query(queryString, queryParams)
    return result.rows
  } catch(error) {
    throw error
  }
}
