'use strict';

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}
const { findById } = require('../services/apikey.service');

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        //check objkey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()

    } catch (error) {
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        console.log('objKey:', req.objKey); // Kiểm tra objKey
        console.log('permissions:', req.objKey ? req.objKey.permissions : 'No permissions');
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permissions not found or objKey is missing'
            })
        }
        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denided'
            })
        }
        return next()


    }
}

module.exports = {
    apiKey,
    permission
}