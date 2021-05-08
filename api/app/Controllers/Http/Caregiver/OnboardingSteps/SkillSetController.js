'use strict';

const path = require('path');

const Logger = use('Logger');
const skillSetService = make(
  'App/Services/Caregiver/OnboardingSteps/SkillSetService',
);
const message = require(path.resolve('app/Constants/Response/index'));
const util = make('App/Services/Common/UtilService');

class SkillSetController {
  async getCaregiverSkillSet({ request, response }) {
    try {
      const caregiver = request.caregiver;
      const data = await skillSetService.getCaregiverSkillSet(caregiver.id);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      Logger.info('Controller getCaregiverSkillSet Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async addCaregiverSkillSet({ request, response }) {
    try {
      const reqData = await request.all();
      const caregiver = request.caregiver;
      await skillSetService.addUpdateCaregiverSkillSet(caregiver, reqData);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SKILLSETS_ADDED,
      });
    } catch (error) {
      Logger.info('Controller AddUpdateExperienceEducation Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = SkillSetController;
