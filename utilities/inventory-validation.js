const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validate = {}

validate.classificationRules = () => {
    return [
        body("classificationName")
            .trim()
            .escape()
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name cannot contain spaces or special characters.")
            .notEmpty()
            .withMessage("Please provide a classification name."),
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classificationName } = req.body
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        return res.render('./inventory/add-classification', {
            errors: errors.array(),
            title: 'Site Management: New Classification',
            nav,
            classificationName,
            errors: null
        })
    }
    next()
}

validate.inventoryRules = () => {
    return [
        body("inv_make").trim().escape().notEmpty().withMessage("Please provide a vehicle make."),
        body("inv_model").trim().escape().notEmpty().withMessage("Please provide a vehicle model."),
        body("inv_year").trim().escape().notEmpty().withMessage("Please provide a vehicle year."),
        body("inv_description").trim().escape().notEmpty().withMessage("Please provide a vehicle description."),
        body("inv_image").trim().notEmpty().withMessage("Please provide an image of the vehicle.")
            .matches(/^\/[a-zA-Z0-9-_\/]+(\.jpg|\.jpeg|\.png)$/).withMessage("Image path must be a valid path and end with .jpg, .jpeg, or .png."),
        body("inv_thumbnail").trim().notEmpty().withMessage("Please provide a thumbnail for the vehicle.")
            .matches(/^\/[a-zA-Z0-9-_\/]+(\.jpg|\.jpeg|\.png)$/).withMessage("Image path must be a valid path and end with .jpg, .jpeg, or .png."),
        body("inv_price").trim().escape().notEmpty().withMessage("Please provide a price.").isNumeric().withMessage('Price must be a number'),
        body("inv_miles").trim().escape().notEmpty().withMessage("Please provide the vehicle mileage.").isNumeric().withMessage('Mileage must be a number'),
        body("inv_color").trim().escape().notEmpty().withMessage("Please provide a vehicle color."),
        body("classification_id").trim().escape().notEmpty().withMessage("Please provide a vehicle classification."),
    ];
};

validate.checkInvData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const title = 'Site Management: New Inventory';
        const nav = await utilities.getNav();
        const classifications = await utilities.getClassifications();
        return res.render('./inventory/add-inventory', {
            title: title,
            nav,
            classifications,
            errors: null,
            ...req.body
        });
    }
    next();
};

validate.checkUpdateData = async (req, res, next) => {
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const title = 'Site Management: Edit '
        const nav = await utilities.getNav();
        const classifications = await utilities.getClassifications();
        const itemName = `${inv_make} ${inv_model}`
        return res.render('./inventory/edit-inventory', {
            title: title,
            nav,
            classifications,
            errors: null,
            ...req.body
        });
    }
    next();
};

module.exports = validate
