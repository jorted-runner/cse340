const invModel = require('../models/inventory-model')
const utilities = require('../utilities/')

const invCont = {}

// Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = await utilities.categoryTitle(data)
    res.render('./inventory/classification', {
        title: className,
        nav,
        grid,
    })
}
invCont.buildCarDetails = async function (req, res, next) {
    const vehicleInv_Id = req.params.vehicleInvId
    const data = await invModel.getInventoryByInventoryId(vehicleInv_Id)
    const details = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    const title = await utilities.vehicleDetailsTitle(data)
    res.render('./inventory/details', {
        title: title,
        nav,
        details,
    })
}

module.exports = invCont