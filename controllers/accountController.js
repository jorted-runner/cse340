const { get } = require('../routes/static')
const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const validate = require('../utilities/account-validation')
const bcrypt = require('bcryptjs')

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render('./account/login', {
        title: 'Login',
        nav,
        errors: null
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render('./account/register', {
        title: 'Register',
        nav, 
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    const user = await accountModel.getUserByEmail(account_email)
    if (user && await accountModel.checkPassword(account_email, account_password)) {
      req.flash(
        "notice",
        `Congratulations ${user.account_firstname}, you're logged in.`
      )
      res.status(200).send(`Congratulations ${user.account_firstname}, you're logged in.`)
    } else {
      req.flash("notice", "Sorry, the login failed.")
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    req.flash("notice", "An error occurred during login.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount }