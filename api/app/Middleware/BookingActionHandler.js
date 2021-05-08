'use strict';

const path = require('path');
const CryptoJS = require('crypto-js');
const Env = use('Env');
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class BookingActionHandler {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({ request, response }, next) {
        const reqData = await request.all();
        const reqUrl = request.request.url;
        if (reqData && reqData.payload && reqUrl) {
            try {
                if (reqUrl.includes('/client/feedback')) {
                    const browserFingerprintHeader = request.request.headers['device-id'];
                    if (!browserFingerprintHeader) {
                        return util.sendErrorResponse(
                            response,
                            message.BROWSER_FINGERPRINT_REQUIRED,
                        );
                    }
                    if (browserFingerprintHeader) {
                        const bytes = CryptoJS.AES.decrypt(
                            reqData.payload,
                            browserFingerprintHeader,
                        );
                        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                        // decryprt bookingdata
                        const reb64 = CryptoJS.enc.Hex.parse(decryptedData.booking_id);
                        const bytesBookingData = reb64.toString(CryptoJS.enc.Base64);
                        const decryptBookingData = CryptoJS.AES.decrypt(bytesBookingData, `${Env.get('APP_KEY', 'D6B13YMGZ8zLKWZb51yh9hC2lXIWZtx8')}`);
                        const bookingData = JSON.parse(decryptBookingData.toString(CryptoJS.enc.Utf8));
                        request.body = { ...decryptedData, ...bookingData };
                    }
                }

                if (reqUrl.includes('/booking/')) {
                    const reb64 = CryptoJS.enc.Hex.parse(reqData.payload);
                    const bytesBookingData = reb64.toString(CryptoJS.enc.Base64);
                    const decryptBookingData = CryptoJS.AES.decrypt(bytesBookingData, `${Env.get('APP_KEY', 'D6B13YMGZ8zLKWZb51yh9hC2lXIWZtx8')}`);
                    const bookingData = JSON.parse(decryptBookingData.toString(CryptoJS.enc.Utf8));
                    request.body = bookingData;
                }
            } catch (error) {
                return util.sendErrorResponse(response, message.SOMETHING_WENT_WRONG);
            }
        } else {
            return util.sendErrorResponse(response, message.SOMETHING_WENT_WRONG);
        }
        // call next to advance the request
        await next();
    }
}

module.exports = BookingActionHandler;
