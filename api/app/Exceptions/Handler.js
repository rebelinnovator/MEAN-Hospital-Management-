'use strict';

const BaseExceptionHandler = use('BaseExceptionHandler');
const HttpStatusCode = require('http-status-codes');
const CryptoJS = require('crypto-js');

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(exception, { response }) {
    if (
      exception.name == 'InvalidJwtToken' ||
      exception.name == 'ExpiredJwtToken'
    ) {
      exception = {
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: 'Unauthorized',
      };
    }
    if (exception.name == 'TooManyRequests') {
      exception = {
        statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
        message: HttpStatusCode.getStatusText(HttpStatusCode.TOO_MANY_REQUESTS),
      };
    }
    let { statusCode, message, data } = exception;
    statusCode = statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    message = message || HttpStatusCode.getStatusText(statusCode);
    data = data || undefined;
    let res = {
      success: false,
      status: statusCode,
      message,
      data,
      // timestamp: new Date().toISOString(),
      // path: request.url,
    };
    try {
      const { request } = response;
      const browserFingerprintHeader = request.headers['device-id'];
      if (request.url.includes('/auth/')) {
        const encryptedBody = CryptoJS.AES.encrypt(
          JSON.stringify(res),
          `${browserFingerprintHeader}`,
        ).toString();
        res = { payload: encryptedBody };
      }
    } catch (error) {
      statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
      message = HttpStatusCode.getStatusText(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
      res = {
        success: false,
        status: statusCode,
        message,
        data: error,
      };
      return response.status(statusCode).json(res);
    }
    return response.status(statusCode).json(res);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
}

module.exports = ExceptionHandler;
