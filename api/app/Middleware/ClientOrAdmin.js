'use strict';

const path = require('path');

const util = make('App/Services/Common/UtilService');
const clientService = make('App/Services/Client/ClientService');
const message = require(path.resolve('app/Constants/Response/index'));

const userType = {
  Admin: 1,
  Caregiver: 2,
  Client: 3,
};

class ClientOrAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next) {
    const user = await auth.getUser();
    if (user.user_type == userType.Caregiver) {
      return util.sendErrorResponse(response, message.FORBIDDEN);
    }
    if (user.is_deleted) {
      return util.sendErrorResponse(response, message.DELETED_USER);
    }
    // check if client user exists or not
    const reqData = await request.all();
    if (reqData.slug) {
      const client = await clientService.checkClientBySlug(reqData.slug);
      if (!client) {
        return util.sendErrorResponse(response, message.CLIENT_NOT_FOUND);
      }
      request.client = client;
    }
    // call next to advance the request
    await next();
  }
}

module.exports = ClientOrAdmin;
