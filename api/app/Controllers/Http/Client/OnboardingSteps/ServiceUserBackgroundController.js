'use strict';

// Libraries
const path = require('path');

const Logger = use('Logger');

// Constants
const message = require(path.resolve('app/Constants/Response/index'));

// Services
const serviceUserBackgroundService = make(
  'App/Services/Client/OnboardingSteps/ServiceUserBackgroundService',
);
const util = make('App/Services/Common/UtilService');

class ServiceUserBackgroundController {
  /**
   * Name: Jainam Shah
   * Purpose: get service user background data for client
   * Params: request, response
   * */
  async getServiceUserBackground({ request, response }) {
    try {
      const client = request.client;
      const data = await serviceUserBackgroundService.getUserBackground(
        client.id,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      Logger.info('Controller getServiceUserBackground Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: add / update service user background for client
   * Params: request, response
   * */
  async addUpdateServiceUserBackground({ request, response }) {
    try {
      const client = request.client;
      // get all client data
      const clientData = await request.except([
        'slug',
        'languages',
        'other_lang',
        'other_devices',
        'specific_drug',
        'selfCareAbilities',
      ]);

      // get all languages data
      const languages = await request.only(['languages', 'other_lang']);

      // get all data for self care abilities
      const selfCareAbilities = await request.only(['selfCareAbilities']);

      // get all data for other devices
      const otherDevices = await request.only([
        'other_devices',
        'specific_drug',
      ]);

      await serviceUserBackgroundService.addUpdateUserBackground(
        client,
        clientData,
        languages,
        selfCareAbilities,
        otherDevices,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SERVICE_USER_BACKGROUND_ADDED,
      });
    } catch (error) {
      Logger.info('Controller addUpdateServiceUserBackground Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = ServiceUserBackgroundController;
