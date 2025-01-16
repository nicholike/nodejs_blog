'use strict';

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response")

class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token success!',
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res);

        //ver2 fixed, no need access token
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            })
        }).send(res);

    }

    logout = async (req, res) => {
        new SuccessResponse({
            message: 'Logged out successfully!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }

    login = async (req, res) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    }

    signUp = async (req, res, next) => {

        // return res.status(200).json({
        //     message:'',
        //     metadata:

        // }
        // )
        new CREATED({
            message: 'Registerted OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);
    }
}

module.exports = new AccessController;