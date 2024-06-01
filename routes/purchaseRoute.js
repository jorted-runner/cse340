// Needed Resources
const express = require('express')
const router = new express.Router() 
const purchaseController = require('../controllers/purchaseController')
const purchaseValidate = require('../utilities/purchase-validation')
const utilities = require('../utilities')

router.get('/:inv_id', utilities.handleErrors(purchaseController.buildPurchase))

router.post(
    '/:inv_id',
    purchaseValidate.checkoutRules(),
    purchaseValidate.checkCheckout,
    utilities.handleErrors(purchaseController.submitCheckout)
)

module.exports = router