/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const env = require('dotenv').config()
const app = express()
const static = require('./routes/static')
const baseController = require('./controllers/baseController')
const inventoryRoute = require('./routes/inventoryRoute')
const utilities = require('./utilities/')

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', './layouts/layout')


/* ***********************
 * Routes
 *************************/
app.use(static)
app.get('/', utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use('/inv', utilities.handleErrors(inventoryRoute))


app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  if (err.status === 404) {
    message = err.message;
  } else if (err instanceof TypeError && err.message.includes("Cannot read properties of undefined")) {
    message = 'The requested item does not exist or is out of range.';
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }

  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
