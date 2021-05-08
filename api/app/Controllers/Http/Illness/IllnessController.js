'use strict';

const path = require('path');

const illnessService = make('App/Services/Illness/IllnessService');
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class IllnessController {
  /**
   * Name: Nirav Goswami
   * Purpose: get illnesses from the system
   * Params: response
   * */
  async getIllnesses({ response }) {
    try {
      // get all illnesses from the system
      const data = await illnessService.getIllnesses();

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

module.exports = IllnessController;
