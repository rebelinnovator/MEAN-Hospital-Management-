'use strict';

const path = require('path');

const Logger = use('Logger');
const serviceUserMedHistoryService = make(
  'App/Services/Client/OnboardingSteps/ServiceUserMedHistoryService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class ServiceUserMedHistoryController {
  async getServiceUserMedHistory({ request, response }) {
    try {
      const client = request.client;
      const data = await serviceUserMedHistoryService.getServiceUserMedHistory(
        client.id,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      Logger.info('Controller getServiceUserMedHistory Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async addServiceUserMedHistory({ request, response }) {
    try {
      const reqData = await request.all();
      const client = request.client;
      await serviceUserMedHistoryService.addServiceUserMedHistory(
        client,
        reqData,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SERVICE_USER_MEDICAL_HISTORY_ADDED,
      });
    } catch (error) {
      Logger.info('Controller addServiceUserMedHistory Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = ServiceUserMedHistoryController;
