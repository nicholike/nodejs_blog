'use strict';
const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");

const { Types } = require("mongoose");
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            console.log("[createKeyToken] Input values:", { userId, publicKey, privateKey, refreshToken });
            const filter = { user: new Types.ObjectId(userId) };
            console.log("[createKeyToken] Filter for finding user key:", filter);

            const update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            };
            console.log("[createKeyToken] Update object:", update);

            const options = { upsert: true, new: true }
            console.log("[createKeyToken] Options for findOneAndUpdate:", options);

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            console.log("[createKeyToken] Tokens after update:", tokens);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error("Error in createKeyToken:", error.message);
            throw error;
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.findByIdAndDelete(new Types.ObjectId(id));
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId })


    }

}

module.exports = KeyTokenService;