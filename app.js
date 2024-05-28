const express = require('express')
const { getTopics } = require('./controllers/topics.controllers')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

//custom error handler
app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status).send({
            status: error.status,
            msg: error.msg
        })
    }
    next(error)
})

module.exports = app