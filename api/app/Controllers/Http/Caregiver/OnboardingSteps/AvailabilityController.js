'use strict';

// Libraries
const path = require('path');

// Constants
const message = require(path.resolve('app/Constants/Response/index'));

// Services
const util = make('App/Services/Common/UtilService');
const availability = make(
  'App/Services/Caregiver/OnboardingSteps/AvailabilityService',
);

class AvailabilityController {
  /**
   * Name: Jainam Shah
   * Purpose: get availability for caregiver
   * Params: request, auth, response
   * */
  async getAvailability({ request, response }) {
    try {
      const caregiver = request.caregiver;

      // get all availabilities for caregiver
      const data = await availability.getAvailability(caregiver.id);

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
   * Purpose: add / update availability for caregiver
   * Params: request, response
   * */
  async addUpdateAvailability({ request, response }) {
    try {
      const reqData = await request.all();
      const caregiver = request.caregiver;

      // checking for availability conflicting hours
      const checkAvailability = await availability.checkAvailability(
        reqData.availability,
      );
      const checkError = checkAvailability.map(e => !!e.success);

      // error if conflict / modify if not
      if (checkError.includes(false)) {
        return await util.sendErrorResponse(response, {
          ...message.CONFLICT_IN_AVAILABILITY,
          data: checkAvailability,
        });
      }
      // modify locations for a caregiver
      await availability.modifyAvailabilityLocations(caregiver, reqData);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.AVAILABILITY_ADDED,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = AvailabilityController;
