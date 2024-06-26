// Needed Resources
const express = require('express')
const router = new express.Router() 
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities')
const accValidate = require('../utilities/account-validation')

router.get('/type/:classificationId', utilities.handleErrors(invController.buildByClassificationId))
router.get('/detail/:vehicleInvId', utilities.handleErrors(invController.buildCarDetails))
router.get('/management', accValidate.checkAdmin, utilities.handleErrors(invController.buildManagement))
router.get('/management/new-class', accValidate.checkAdmin, utilities.handleErrors(invController.buildNewClass))
router.get('/management/new-inv', accValidate.checkAdmin, utilities.handleErrors(invController.buildNewInv))
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON));
router.get('/edit/:inv_id', accValidate.checkAdmin, utilities.handleErrors(invController.editInventory));
router.get('/delete/:inv_id', accValidate.checkAdmin, utilities.handleErrors(invController.buildDeleteInventory));

router.post(
  "/management/new-class",
  accValidate.checkAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addNewClass)
);

router.post(
  "/management/new-inv",
  accValidate.checkAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addNewInventory)
);

router.post(
  '/update/',
  accValidate.checkAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.post(
  '/delete/',
  accValidate.checkAdmin,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;