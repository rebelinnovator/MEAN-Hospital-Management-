'use strict';

const path = require('path');
const CryptoJS = require('crypto-js');

const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class Encryptor {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    const reqData = await request.all();
    const browserFingerprintHeader = request.request.headers['device-id'];
    if (!browserFingerprintHeader) {
      return util.sendErrorResponse(
        response,
        message.BROWSER_FINGERPRINT_REQUIRED,
      );
    }
    if (browserFingerprintHeader && reqData && reqData.payload) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          reqData.payload,
          browserFingerprintHeader,
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        request.body = decryptedData;
      } catch (error) {
        return util.sendErrorResponse(response, message.SOMETHING_WENT_WRONG);
      }
    }
    // call next to advance the request
    await next();
  }
}

module.exports = Encryptor;
