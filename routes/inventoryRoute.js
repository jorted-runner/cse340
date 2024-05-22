// Needed Resources
const express = require('express')
const router = new express.Router() 
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities')

router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:vehicleInvId', invController.buildCarDetails);
router.get('/management', invController.buildManagement);
router.get('/management/new-class', invController.buildNewClass);
router.get('/management/new-inv', invController.buildNewInv);
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))
router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventory))

router.post(
  "/management/new-class",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addNewClass)
);

router.post(
  "/management/new-inv",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addNewInventory)
);

router.post('/update/',
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router;