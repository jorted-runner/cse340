// Needed Resources
const express = require('express')
const router = new express.Router() 
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

// Remember to fix this accountsController function
router.get('/login', accountController.buildLogin)
router.get('/register', accountController.buildRegister)

// Post requests
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )
module.exports = router;