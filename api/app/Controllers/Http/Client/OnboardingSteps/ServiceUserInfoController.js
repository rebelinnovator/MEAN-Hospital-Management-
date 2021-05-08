'use strict';

const path = require('path');

const Logger = use('Logger');
const serviceUserInfoService = make(
  'App/Services/Client/OnboardingSteps/ServiceUserInfoService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class ServiceUserInfoController {
  async getServiceUserInfo({ request, response }) {
    try {
      const client = request.client;
      const data = await serviceUserInfoService.getServiceUserInfo(client.id);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      Logger.info('Controller getServiceUserInfo Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async addServiceUserInfo({ request, response }) {
    try {
      const reqData = await request.all();
      const client = request.client;
      await serviceUserInfoService.addServiceUserInfo(client, reqData);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SERVICE_USER_INFO_ADDED,
      });
    } catch (error) {
      Logger.info('Controller addServiceUserInfo Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = ServiceUserInfoController;
