'use strict';

const path = require('path');

const util = make('App/Services/Common/UtilService');
const caregiverService = make('App/Services/Caregiver/CaregiverService');
const message = require(path.resolve('app/Constants/Response/index'));

const userType = {
  Admin: 1,
  Caregiver: 2,
  Client: 3,
};

class CaregiverOrAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next) {
    const user = await auth.getUser();
    if (user.user_type == userType.Client) {
      return util.sendErrorResponse(response, message.FORBIDDEN);
    }

    if (user.is_deleted) {
      return util.sendErrorResponse(response, message.DELETED_USER);
    }
    const reqData = await request.all();
    // check if caregiver exists or not
    if (reqData.registration_no) {
      const caregiver = await caregiverService.checkCaregiver(
        reqData.registration_no,
      );
      if (!caregiver) {
        return util.sendErrorResponse(response, message.CAREGIVER_NOT_FOUND);
      }
      request.caregiver = caregiver;
    }
    // call next to advance the request
    await next();
  }
}

module.exports = CaregiverOrAdmin;
