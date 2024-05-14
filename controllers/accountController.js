const { get } = require('../routes/static')
const utilities = require('../utilities/')
const accountModel = require('../models/account-model')

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const login = await utilities.buildLogin()
    res.render('./account/login', {
        title: 'Login',
        nav,
        login
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    const registerForm = await utilities.buildRegister()
    res.render('./account/register', {
        title: 'Register',
        nav, 
        registerForm
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      const login = await utilities.buildLogin()
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        login
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

module.exports = { buildLogin, buildRegister, registerAccount }