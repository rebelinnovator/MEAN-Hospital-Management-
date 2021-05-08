'use strict';

const path = require('path');

const systemSettingService = make(
  'App/Services/SystemSetting/SystemSettingService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class SystemSettingController {
  /**
   * Name: Nirav Goswami
   * Purpose: get systemSettings from the system
   * Params: response
   * */
  async getSystemSettings({ response }) {
    try {
      // get all systemSettings from the system
      const data = await systemSettingService.getSystemSettings();

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: update systemSettings for the system
   * Params: request, response
   * */
  async updateSystemSettings({ request, response }) {
    try {
      const reqData = await request.all();

      const data = await systemSettingService.updateSystemSettings(reqData);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = SystemSettingController;
