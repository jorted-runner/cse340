const pool = require('../database/')

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}
async function getUserByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    if (result.rowCount > 0) {
      return result.rows[0]
    }
    return null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    throw new Error("Database error")
  }
}
async function checkPassword(account_email, entered_password) {
  try {
    const sql = "SELECT account_password FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    if (result.rowCount > 0) {
      const storedPassword = result.rows[0].account_password
      return storedPassword === entered_password
    } else {
      return false
    }
  } catch (error) {
    console.error("Error checking password:", error)
    throw new Error("Database error")
  }
}

module.exports = { registerAccount, checkExistingEmail, checkPassword, getUserByEmail}