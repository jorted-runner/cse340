// Needed Resources
const express = require('express')
const router = new express.Router() 
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')
const { route } = require('./static')

// Remember to fix this accountsController function
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.get('/update/:account_id', regValidate.checkMatch, utilities.handleErrors(accountController.buildUpdate))

router.get("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
});

// Post requests
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.post('/update/:account_id',
  regValidate.checkMatch,
  utilities.handleErrors(accountController.accountUpdate)
);

module.exports = router;