// Needed Resources
const express = require('express')
const router = new express.Router() 
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities')
// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:vehicleInvId', invController.buildCarDetails)
router.get('/management', invController.buildManagement)
router.get('/management/new-class', invController.buildNewClass)

router.post(
    "/management/new-class",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addNewClass)
  )
module.exports = router;