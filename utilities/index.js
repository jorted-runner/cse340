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

Util.buildLogin = async function() {
  let login = " <form class='form' id='login' method='post'><fieldset><label>Email or Username <input type='text' name='email' id='email' required placeholder='chef@chefscabinet.com'></label><label>Password <input type='password' name='password' id='password' required></label></fieldset><input type='submit' value='Login'></form>"
  login += "<p>No Account? <a href='../../account/register'>Sign-up</a></p>"
  return login
}

Util.buildRegister = async function() {
  let form = `
    <form class="form" id="register" method="post">
      <fieldset>
        <legend>Registration Information</legend>
        <label>First Name* <input type="text" name="account_firstname" required autocomplete="given-name"></label>
        <label>Last Name* <input type="text" name="account_lastname" required autocomplete="family-name"></label>
        <label>Email Address* <input type="email" name="account_email" required placeholder="chef@chefscabinet.com"></label>
        <label>Username* <input type="text" name="account_username" required></label>
        <label>Password*
        <span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span> 
          <input type="password" id="password" name="account_password" required 
            pattern="(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{12,}" 
            title="Password must be at least 12 characters long, contain at least one uppercase letter, one number, and one special character.">
          <button type="button" id="togglePassword" aria-label="Toggle password visibility">👁️</button>
        </label>
      </fieldset>
      <input type="submit" value="Register">
    </form>
    <script>
      document.getElementById('togglePassword').addEventListener('click', function (e) {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️';
      });
    </script>
  `
  return form
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util