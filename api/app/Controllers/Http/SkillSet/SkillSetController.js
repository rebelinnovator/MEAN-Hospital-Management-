'use strict';

const path = require('path');

const skillSetService = make('App/Services/SkillSet/SkillSetService');
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class SkillSetController {
  /**
   * Name: Jainam Shah
   * Purpose: get SkillSet from the system
   * Params: response
   * */
  async getSkillSet({ request, response }) {
    try {
      const reqData = await request.all();
      // get all SkillSet from the system
      const data = await skillSetService.getSkillSet(reqData);

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

module.exports = SkillSetController;
