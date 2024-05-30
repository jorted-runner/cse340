// Needed Resources
const express = require('express')
const router = new express.Router() 
const purchaseController = require('../controllers/purchaseController')
const utilities = require('../utilities')

router.get('/:inv_id', utilities.handleErrors(purchaseController.buildPurchase))

module.exports = router