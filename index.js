const express = require('express')
const app = express()
const port = 3000
const getCotizaciones = require('./controllers/getCotizaciones.js')

// Middleware to parse JSON request bodies
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/cotizaciones', getCotizaciones)

app.listen(port, () => {
  console.log(`Example app listening on port ${port} con nodemon!`)
})

// Export the app for testing
module.exports = app;