'use strict';

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env');
const ErrorHandler = use('App/Services/Common/Helper');
const HttpStatusCode = require('http-status-codes');
const got = require('got');
const CryptoJS = require('crypto-js');

/**
 *
 *
 * @class UtilService
 */
class UtilService {
  /**
   *
   *
   * @param {*} response
   * @param {*} status
   * @param {*} success
   * @param {*} messages
   * @param {*} data
   * @returns
   * @memberof UtilService
   */
  sendSuccessResponse(response, { status, success, message, data }) {
    let resObj = {
      success,
      status,
      message,
      data,
    };
    try {
      const { request } = response;
      const browserFingerprintHeader = request.headers['device-id'];
      if (request.url.includes('/auth/')) {
        const encryptedBody = CryptoJS.AES.encrypt(
          JSON.stringify(resObj),
          `${browserFingerprintHeader}`,
        ).toString();
        resObj = { payload: encryptedBody };
      }
    } catch (error) {
      status = HttpStatusCode.INTERNAL_SERVER_ERROR;
      message = HttpStatusCode.getStatusText(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
      resObj = {
        success: false,
        status,
        message,
        data: error,
      };
      return response.status(status).json(resObj);
    }
    return response.status(status).json(resObj);
  }

  replaceErrors(key, value) {
    if (value instanceof Error) {
      const error = {};
      Object.getOwnPropertyNames(value).forEach(key1 => {
        error[key1] = value[key1];
      });
      return error;
    }
    return value;
  }

  getPureError(error) {
    return JSON.parse(JSON.stringify(error, this.replaceErrors));
  }

  /**
   *
   *
   * @param {*} {status, message}
   * @memberof UtilService
   */
  sendErrorResponse(
    response,
    {
      status = HttpStatusCode.INTERNAL_SERVER_ERROR,
      message = HttpStatusCode.getStatusText(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      ),
      data,
    } = {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: HttpStatusCode.getStatusText(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      ),
    },
  ) {
    data = data ? this.getPureError(data) : undefined;
    let resObj = {
      success: false,
      status,
      message,
      data,
    };
    try {
      const { request } = response;
      const browserFingerprintHeader = request.headers['device-id'];
      if (request.url.includes('/auth/')) {
        const encryptedBody = CryptoJS.AES.encrypt(
          JSON.stringify(resObj),
          `${browserFingerprintHeader}`,
        ).toString();
        resObj = { payload: encryptedBody };
      }
    } catch (error) {
      status = HttpStatusCode.INTERNAL_SERVER_ERROR;
      message = HttpStatusCode.getStatusText(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
      resObj = {
        success: false,
        status,
        message,
        data: error,
      };
      return response.status(status).json(resObj);
    }
    return response.status(status).json(resObj);
  }

  /**
   *
   *
   * @param {*} error
   * @memberof UtilService
   */
  handleBadRequest(error) {
    throw new ErrorHandler(
      HttpStatusCode.BAD_REQUEST,
      HttpStatusCode.getStatusText(HttpStatusCode.BAD_REQUEST),
      error,
    );
  }

  /**
   * For creating pagination
   * @param totalRecords
   * @param pageNumber
   * @param recordPerPage
   * @param data
   */
  createPagination(totalRecords, pageNumber, recordPerPage, data) {
    const pages = Math.ceil(totalRecords / recordPerPage);
    return {
      totalRecords,
      currentPage: pageNumber,
      recordPerPage,
      previous:
        pageNumber > 0 ? (pageNumber == 1 ? null : pageNumber - 1) : null,
      pages,
      next: pageNumber < pages ? pageNumber + 1 : null,
      data,
    };
  }

  async sendWhatsAppMessage(to, message) {
    try {
      to = Env.get('TEST_NUMBER') ? Env.get('TEST_NUMBER') : `+852${to}`;
      const response = await got.post(
        `https://api.chat-api.com/instance${Env.get(
          'INSTANCE_ID',
        )}/sendMessage?token=${Env.get('API_KEY')}`,
        // )}/sendLink?token=${Env.get('API_KEY')}`,
        {
          json: {
            phone: to,
            body: message,
          },
        },
      );
      return response.body;
    } catch (error) {
      // throw error.response.body;
      console.log('sendWhatsAppMessage Error', error);
    }
  }
}

module.exports = UtilService;
