const utilities = require('.')
const { body, validationResult } = require('express-validator')
const invModel = require('../models/inventory-model')
const validate = {}

validate.checkoutRules = () => {
    return [
        body('firstName')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('First name cannot be empty, provide a first name.')
            .matches(/^[A-Za-z]+$/)
            .withMessage('First name cannot contain spaces or special characters.'),
        body('lastName')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Last name cannot be empty, provide a last name.')
            .matches(/^[A-Za-z]+$/)
            .withMessage('Last name cannot contain spaces or special characters.'),
        body('email')
            .trim()
            .isEmail()
            .withMessage("A valid email is required.")
            .normalizeEmail(),
        body('phone')
            .trim()
            .isMobilePhone('en-US') 
            .withMessage('Please provide a valid phone number'),
        body('address')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Address cannot be empty'),
        body('city')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('City cannot be empty')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('City cannot contain any special characters.'),
        body('state')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('State cannot be empty')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('State cannot contain any special characters.'),
        body('zip')
            .trim()
            .notEmpty()
            .withMessage('Provide a valid Zipcode')
            .isPostalCode('US') 
            .withMessage('Zipcode cannot contain any special characters'),
        body('cardName')
            .trim()
            .escape()
            .notEmpty()
            .withMessage('Card name cannot be empty, provide a name.')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('Card name cannot contain spaces or special characters.'),
        body('cardNumber')
            .trim()
            .isCreditCard()
            .withMessage('Provide a valid credit card number'),
        body('expMonth')
            .trim()
            .isNumeric()
            .withMessage('Exp Month should be numeric')
            .isLength({ min: 2, max: 2 })
            .withMessage('Exp Month should be 2 digits'),
        body('expYear')
            .trim()
            .isNumeric()
            .withMessage('Exp Year should be numeric')
            .isLength({ min: 2, max: 2 })
            .withMessage('Exp Year should be 2 digits'),
        body('ccv')
            .trim()
            .isNumeric()
            .withMessage('CCV code cannot contain any special characters')
    ];
}

validate.checkCheckout = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zip,
            cardName,
            cardNumber,
            expMonth,
            expYear,
            ccv
        } = req.body
        const inv_id = req.params.inv_id
        const data = await invModel.getInventoryByInventoryId(inv_id)
        const nav = await utilities.getNav();
        price = parseInt(data[0].inv_price)
        tax = price * .18
        return res.render('./purchase/purchase', {
            inv_id: inv_id,
            title: `Purchase ${data[0].inv_make} ${data[0].inv_model}`,
            nav,
            errors: errors,
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zip,
            cardName,
            cardNumber,
            expMonth,
            expYear,
            ccv,
            inv_price: price,
            tax: tax,
            total: price + tax 
        });
    }
    next();
};

module.exports = validate