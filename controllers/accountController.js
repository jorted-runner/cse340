const { get } = require('../routes/static')
const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const validate = require('../utilities/account-validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Util = require('../utilities/')
require('dotenv').config()

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

async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  const classifications = await utilities.getClassifications()
  res.render('./account/management', {
      title: 'Account Management',
      nav,
      classifications,
      errors: null,
  })
}

async function buildUpdate(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id
  const data = await accountModel.getAccountByID(account_id)
  const title = `Update Account: ${data.account_firstname} ${data.account_lastname}`
  res.render('./account/update', {
    title: title,
    nav,
    errors: null,
    account_id: data.account_id,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_password: data.account_password
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

  async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
    return
    }
    try {
     if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
      return res.redirect("/account/")
     }
    } catch (error) {
      return new Error('Access Forbidden')
    }
}

async function accountUpdate(req, res) {
  if (req.body.account_password) {
    const { account_id, account_password } = req.body
    let validPass = await validate.checkValidPassword(account_password)
    if (!validPass) {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountByID(account_id)
      req.flash("notice", 'Sorry, new password did not meet the requirements.')
      res.status(500).render(`account/update`, {
        title: `Update Account: ${data.account_firstname} ${data.account_lastname}`,
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_password: data.account_password
      })
      return
    }
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountByID(account_id)
      req.flash("notice", 'Sorry, there was an error processing your new password.')
      res.status(500).render(`account/update`, {
        title: `Update Account: ${data.account_firstname} ${data.account_lastname}`,
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_password: data.account_password
      })
    }
    const regResult = await accountModel.updatePassword(
      hashedPassword,
      account_id,
    )
    if (regResult) {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountByID(account_id)
      req.flash(
        "notice",
        `Congratulations, ${data.account_firstname}. Password successfully changed.`
      )
      res.status(201).render(`account/update`, {
        title: `Update Account: ${data.account_firstname} ${data.account_lastname}`,
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_password: data.account_password
      })
    } else {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountByID(account_id)
      req.flash("notice", 'Sorry, there was an error processing your new password.')
      res.status(500).render(`account/update`, {
        title: `Update Account: ${data.account_firstname} ${data.account_lastname}`,
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_password: data.account_password
      })
    }
  } else {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const emailMatches = await accountModel.checkMatching(account_email, account_id)
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (!emailMatches && emailExists) {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountByID(account_id)
      req.flash("notice", 'Email already associated with a different account.')
      res.status(500).render(`account/update`, {
        title: `Update Account: ${data.account_firstname} ${data.account_lastname}`,
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_password: data.account_password
      })
    }
    const regResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    )
    if (regResult) {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountByID(account_id)
      req.flash(
        "notice",
        `Congratulations, ${data.account_firstname}. Account successfully changed.`
      )
      res.status(201).render(`account/update`, {
        title: `Update Account: ${data.account_firstname} ${data.account_lastname}`,
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_password: data.account_password
      })
    } else {
      let nav = await utilities.getNav()
      const data = await accountModel.getAccountByID(account_id)
      req.flash("notice", 'Sorry, there was an error updating your account.')
      res.status(500).render(`account/update`, {
        title: `Update Account: ${data.account_firstname} ${data.account_lastname}`,
        nav,
        errors: null,
        account_id: data.account_id,
        account_firstname: data.account_firstname,
        account_lastname: data.account_lastname,
        account_email: data.account_email,
        account_password: data.account_password
      })
    }
  }

}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildUpdate, accountUpdate }