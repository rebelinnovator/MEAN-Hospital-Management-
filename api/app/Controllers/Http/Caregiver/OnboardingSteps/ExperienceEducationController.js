'use strict';

const path = require('path');

const Logger = use('Logger');
const experienceEducationService = make(
  'App/Services/Caregiver/OnboardingSteps/ExperienceEducationService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class ExperienceEducationController {
  async addUpdateExperienceEducation({ request, response }) {
    try {
      const reqData = await request.all();
      const caregiver = request.caregiver;

      await experienceEducationService.addUpdateExperienceEducation(
        caregiver,
        reqData,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.EXPERIENCE_EDUCATION_ADDED,
      });
    } catch (error) {
      Logger.info('Controller AddUpdateExperienceEducation Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async updateShowEmployerStatus({ request, response }) {
    try {
      const reqData = await request.all();
      const caregiver = request.caregiver;

      caregiver.show_employer_option = reqData.show_employer_option;
      if (caregiver.current_step === '2') {
        caregiver.current_step = '3';
      }

      await caregiver.save();

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      Logger.info('Controller updateShowEmployerStatus Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async getExperienceEducation({ request, response }) {
    try {
      const caregiver = request.caregiver;
      const data = await experienceEducationService.getExperienceEducation(
        caregiver.id,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      Logger.info('Controller getExperienceEducation Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = ExperienceEducationController;
