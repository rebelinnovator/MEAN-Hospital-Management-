'use strict';

const path = require('path');

const locationService = make('App/Services/Location/LocationService');
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class LocationController {
  /**
   * Name: Jainam Shah
   * Purpose: get locations from the system
   * Params: response
   * */
  async getLocations({ response }) {
    try {
      // get all locations from the system
      const data = await locationService.getLocations();

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

module.exports = LocationController;
