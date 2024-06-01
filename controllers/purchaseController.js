const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')
const { body, validationResult } = require('express-validator')


const purchaseCont = {}

purchaseCont.buildPurchase = async function (req, res, next) {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryByInventoryId(inv_id)
    let nav = await utilities.getNav()
    price = parseInt(data[0].inv_price)
    tax = price * .18
    res.render('./purchase/purchase', {
        title: `Purchase ${data[0].inv_make} ${data[0].inv_model}`,
        nav,
        errors: null,
        inv_id: inv_id,
        inv_make: data[0].inv_make,
        inv_model: data[0].inv_model,
        inv_price: price,
        tax: tax,
        total: price + tax 
    })
}

purchaseCont.submitCheckout = async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        const inv_id = req.params.inv_id;
        const data = await invModel.getInventoryByInventoryId(inv_id);
        const price = parseInt(data[0].inv_price);
        const tax = price * 0.18;
        
        return res.status(400).render('./purchase/purchase', {
            inv_id: inv_id,
            title: `Purchase ${data[0].inv_make} ${data[0].inv_model}`,
            nav,
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            cardName: req.body.cardName,
            cardNumber: req.body.cardNumber,
            expMonth: req.body.expMonth,
            expYear: req.body.expYear,
            ccv: req.body.ccv,
            inv_price: price,
            tax: tax,
            total: price + tax
        });
    }

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
    } = req.body;

    const inv_id = req.params.inv_id;

    try {
        const isAvailable = await invModel.checkAvailable(inv_id);

        if (isAvailable) {
            const data = await invModel.getInventoryByInventoryId(inv_id);
            const remove_model = await invModel.deleteInventory(inv_id);
            if (remove_model) {
                req.flash(
                    "notice",
                    `Congratulations, ${data[0].inv_make} ${data[0].inv_model} successfully purchased.`
                );

                return res.status(201).redirect('/'); 
            } else {
                throw new Error("Failed to delete inventory");
            }
        } else {
            throw new Error("Item is no longer available");
        }
    } catch (err) {
        req.flash(
            "notice",
            `${err.message}`
        );
        const data = await invModel.getInventoryByInventoryId(inv_id);
        const nav = await utilities.getNav();
        const price = parseInt(data[0].inv_price);
        const tax = price * 0.18;

        return res.status(500).render('./purchase/purchase', {
            inv_id: inv_id,
            title: `Purchase ${data[0].inv_make} ${data[0].inv_model}`,
            nav,
            errors: null,
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
};

module.exports = purchaseCont