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

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port} con nodemon!`)
  })
}

// Export the app for testing
module.exports = app;

// Export a function to start the server (useful for programmatic control)
module.exports.startServer = function() {
  return app.listen(port, () => {
    console.log(`Example app listening on port ${port} con nodemon!`)
  })
};