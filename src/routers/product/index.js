'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authutils');
const router = express.Router()

//authentication
router.use(authenticationV2)
///////
router.post('/shop/product', asyncHandler(productController.createProduct))

module.exports = router;