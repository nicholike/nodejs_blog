'use strict';

const { apiKey, permission } = require("../../auth/checkAuth");

//check apiKeys
router.use(apiKey)
//check permissions
router.use(permission('0000'));

router.use('/v1/api', require('../access'))
router.use('/v1/api/product', require('../product'))
