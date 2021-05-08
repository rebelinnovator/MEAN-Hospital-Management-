'use strict';

const path = require('path');

const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

const userType = {
  Admin: 1,
  Caregiver: 2,
  Client: 3,
};

class IsClient {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, response }, next) {
    const user = await auth.getUser();
    if (user.is_deleted) {
      return util.sendErrorResponse(response, message.DELETED_USER);
    }
    if (user.user_type != userType.Client) {
      return util.sendErrorResponse(response, message.FORBIDDEN);
    }
    // call next to advance the request
    await next();
  }
}

module.exports = IsClient;
