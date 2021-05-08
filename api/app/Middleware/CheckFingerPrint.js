'use strict';

const path = require('path');

const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

const jwt = require('jsonwebtoken')

class CheckFingerPrint {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({ auth, request, response }, next) {
        const authorizationheader = request.request.headers.authorization;
        const browserFingerprintHeader = request.request.headers['device-id'];

        if (authorizationheader) {
            const token = authorizationheader.split(' ')[1];
            if (token) {
                const data = jwt.decode(token);
                const browser_fingerprint = data && data.data && data.data.browser_fingerprint;
                if (browser_fingerprint !== browserFingerprintHeader) {
                    return util.sendErrorResponse(response, message.INVALID_TOKEN);
                }
            }
        }
        // call next to advance the request
        await next();
    }
}

module.exports = CheckFingerPrint;
