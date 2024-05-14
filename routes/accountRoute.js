// Needed Resources
const express = require('express')
const router = new express.Router() 
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')

// Remember to fix this accountsController function
router.get('/login', accountController.buildLogin)
router.get('/register', accountController.buildRegister)

// Post requests
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;