'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authutils");
const { getInfoData } = require("../utils/index");
const { BadRequestError, ConflicRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
//service
const { findByEmail } = require("./shop.service");
const keytokenModel = require("../models/keytoken.model");


const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend!! Please relogin')
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered 1')

        const foundShop = await findByEmail(email)
        if (!foundShop) throw new AuthFailureError('Shop not registered 2')
        //create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
            }
        })

        return {
            user,
            tokens
        }
    }

    /*
    check this token used?

    */
    // static handlerRefreshToken = async (refreshToken) => {
    //     const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    //     if (foundToken) {
    //         //decode xem may la thang nao?
    //         const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
    //         console.log({ userId, email });
    //         //xoa
    //         await KeyTokenService.deleteKeyById(userId)
    //         throw new ForbiddenError('Something wrong happend!! Please relogin')
    //     }
    //     //No, qua' ngon
    //     const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    //     if (!holderToken) throw new AuthFailureError('Shop not registered 1')

    //     //verify token
    //     const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    //     console.log('[2]--', { userId, email })
    //     //check userId
    //     const foundShop = await findByEmail(email)
    //     if (!foundShop) throw new AuthFailureError('Shop not registered 2')
    //     //create 1 cap moi
    //     const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
    //     //update token
    //     await holderToken.updateOne({
    //         $set: {
    //             refreshToken: tokens.refreshToken
    //         },
    //         $addToSet: {
    //             refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
    //         }
    //     })

    //     return {
    //         user: { userId, email },
    //         tokens
    //     }
    // }

    //logout
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }


    /*
    1 - check email in dbs
    2 - match pasword
    3 - create Access Token & Refresh Token and save
    4 - get data return login
   /** */

    static login = async ({ email, password, refreshToken = null }) => {
        //1.
        const foundShop = await findByEmail(email);
        if (!foundShop) throw new BadRequestError('Shop not registered');
        //2.
        console.log("foundshop", foundShop.password)
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authenication error');
        //3.
        //create privateKey & publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        //4. generate tokens
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens

        }
    }

    static signUp = async ({ name, email, password }) => {
        // try {
        //step1: check email exists?
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!');
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            //public key cryptoGraphy standards

            console.log({ privateKey, publicKey })// save collection KeyStore

            //ver2( đơn giản )
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey
            })

            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'keyStore error'
                }
            }

            //created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log(`created token success::`, tokens)
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
            // save collection TokenPair
            // const tokens = await
        }

        return {
            code: 200,
            metadata: null
        }

        // } catch (error) {
        //     console.error(`[ERROR]`, error);

        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService;