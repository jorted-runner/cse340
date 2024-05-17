const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validate = {}
const accountModel = require('../models/account-model')

validate.classificationRules = () => {
    return [
        body("classificationName")
            .trim()
            .escape()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name cannot contain spaces or special characters.")
            .notEmpty()
            .withMessage("Please provide a classification name."),
    ];
};

validate.checkClassData = async (req, res, next) => {
    const { classificationName } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        return res.render('./inventory/add-classification', {
            errors: errors.array(),
            title: 'Site Management: New Classification',
            nav,
            classificationName,
            errors: null
        });
    }
    next();
};

module.exports = validate
