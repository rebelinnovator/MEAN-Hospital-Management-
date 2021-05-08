'use strict';

const path = require('path');

const Logger = use('Logger');
const userService = make('App/Services/User/UserService');
const accountUserInfoService = make(
  'App/Services/Client/OnboardingSteps/AccountUserInfoService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class AccountUserInfoController {
  async getAccountUserInfo({ request, response }) {
    try {
      const reqData = await request.all();
      // check if client user exists or not
      const clientUser = await userService.checkUser(reqData.user_id);
      if (!clientUser) {
        return await util.sendErrorResponse(response, message.CLIENT_NOT_FOUND);
      }

      const data = await accountUserInfoService.getAccountUserInfo(
        clientUser.id,
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      Logger.info('Controller getAccountUserInfo Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async addAccountUserInfo({ request, response }) {
    try {
      const reqData = await request.all();
      // check if client user exists or not
      const clientUser = await userService.checkUser(reqData.user_id);
      if (!clientUser) {
        return await util.sendErrorResponse(response, message.CLIENT_NOT_FOUND);
      }

      const data = await accountUserInfoService.addAccountUserInfo(
        clientUser,
        reqData,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.ACCOUNT_USER_INFO_ADDED,
        data,
      });
    } catch (error) {
      Logger.info('Controller addAccountUserInfo Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = AccountUserInfoController;
