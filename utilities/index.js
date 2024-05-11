const invModel = require('../models/inventory-model')
const Util = {}

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

// build classification view HTML
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

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
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util