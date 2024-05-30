const app = require('./app')

const { port = 9090 } = process.env

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})