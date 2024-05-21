const invModel = require('../models/inventory-model')
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<ul>'
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li>'
        list += '<a href="/inv/type/' + row.classification_id + '" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + '</a>'
        list += '</li>'
    })
    list += '</ul>'
    return list
}

Util.vehicleDetailsTitle = async function(data) {
  if (data && data.length > 0) {
    return `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  } else { 
    return 'Error, no data found.';
  }
};

Util.categoryTitle = async function(data) {
  if (data && data.length > 0) {
    return `${data[0].classification_name}`;
  } else { 
    return 'Error, no data found.';
  }
};

// build classification view HTML
Util.buildClassificationGrid = async function(data){
  let grid = ''; // Initialize grid
  if(data && data.length > 0){
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += '<li>';
      grid += '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleDetails = async function(data) {
  let carDetails = ''; 
  if(data.length > 0){
    carDetails += '<div class="car-details">'
    data.forEach(vehicle => {
      carDetails +=  `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make}">`
      carDetails += `<div><h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2><p><strong>Price: </strong>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
      carDetails += `<p><strong>Description: </strong>${vehicle.inv_description}</p>`
      carDetails += `<p><strong>Color: </strong> ${vehicle.inv_color}</p>`
      carDetails += `<p><strong>Miles: </strong> ${vehicle.inv_miles}</p>`
      carDetails += '</div>'
    })
    carDetails += '</div>'
  } else {
    carDetails += '<p class="notice">Sorry, no matching vehicle found.</p>'
  }
  return carDetails
};

Util.getClassifications = async function() {
  let data = await invModel.getClassifications()
  return data.rows
}

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util