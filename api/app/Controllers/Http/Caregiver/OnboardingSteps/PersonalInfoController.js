'use strict';

const path = require('path');

const Logger = use('Logger');
const personalInfoService = make(
  'App/Services/Caregiver/OnboardingSteps/PersonalInfoService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class PersonalInfoController {
  async getPersonalInfo({ request, response }) {
    try {
      const caregiver = request.caregiver;
      const data = await personalInfoService.getPersonalInfo(caregiver.id);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      Logger.info('Controller getPersonalInfo Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async addPersonalInfo({ request, response }) {
    try {
      let reqData = await request.all();
      const caregiver = request.caregiver;
      if (caregiver.toJSON().current_step === null) {
        reqData = request.only(['mobile_number', 'languages']);
        const user = await caregiver.user().fetch();
        user.mobile_number = reqData.mobile_number;
        await user.save();
        await caregiver.languages().delete();
        await caregiver.languages().createMany(reqData.languages);
        return util.sendSuccessResponse(response, {
          success: true,
          ...message.PERSONAL_INFO_ADDED,
        });
      }

      if (reqData.refferers_email) {
        const referralEmail = await personalInfoService.checkEmail(
          reqData.refferers_email,
        );
        if (!referralEmail) {
          return await util.sendErrorResponse(
            response,
            message.REFERRAL_EMAIL_NOT_EXISTS,
          );
        }
      }
      await personalInfoService.addPersonalInfo(caregiver, reqData);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.PERSONAL_INFO_ADDED,
      });
    } catch (error) {
      Logger.info('Controller addPersonalInfo Catch %s', error);
      if (error === message.EMAIL_ALREADY_REGISTERED) {
        return util.sendErrorResponse(
          response,
          message.EMAIL_ALREADY_REGISTERED,
        );
      }
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = PersonalInfoController;
