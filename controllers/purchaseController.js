const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

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
        inv_make: data[0].inv_make,
        inv_model: data[0].inv_model,
        inv_price: price,
        tax: tax,
        total: price + tax 
    })
}

module.exports = purchaseCont