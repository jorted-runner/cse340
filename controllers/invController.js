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

invCont.buildManagement = async function (req, res, next) {
    const title = 'Site Management'
    const newClass = '<a href="../inv/management/new-class">Add New Classification</a>'
    const newInv = '<a href="#">Add New Inventory</a>'
    const nav = await utilities.getNav()
    res.render('./inventory/management', {
        title: title,
        nav,
        new_classification: newClass,
        new_inventory: newInv,
    })
}

invCont.buildNewClass = async function (req, res, next) {
    const title = 'Site Management: New Classification'
    const nav = await utilities.getNav()
    res.render('./inventory/add-classification', {
        title: title,
        nav,
        errors: null
    })
}


invCont.addNewClass = async function (req, res, next) {
    try {
        const nav = await utilities.getNav();
        const { classificationName } = req.body;
        
        const regResult = await invModel.addNewClass(classificationName);
        
        if (regResult) {
            const title = 'Site Management';
            const newClass = '<a href="../inv/management/new-class">Add New Classification</a>';
            const newInv = '<a href="#">Add New Inventory</a>';
            const nav = await utilities.getNav()
            req.flash("notice", `Congratulations, ${classificationName} has been added successfully.`);
            return res.status(201).render('./inventory/management', {
                title: title,
                nav,
                new_classification: newClass,
                new_inventory: newInv,
                errors: null
            });
        } else {
            throw new Error("Failed to add classification");
        }
    } catch (error) {
        const nav = await utilities.getNav();
        const title = 'Add New Classification';
        req.flash("notice", "Sorry, the adding classification failed.");
        return res.status(501).render('./inventory/add-classification', {
            title: title,
            nav,
            errors: null
        });
    }
};

module.exports = invCont