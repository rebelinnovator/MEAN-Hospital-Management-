'use strict';

// Libraries
const path = require('path');

// Services
const abilityService = make(
  'App/Services/SelfCareAbility/SelfCareAbilityService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class SelfCareAbilityController {
  /**
   * Name: Jainam Shah
   * Purpose: get self care abilities from the system
   * Params: response
   * */
  async getSelfCareAbility({ response }) {
    try {
      // get all locations from the system
      const data = await abilityService.getSelfCareAbilities();

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

module.exports = SelfCareAbilityController;
