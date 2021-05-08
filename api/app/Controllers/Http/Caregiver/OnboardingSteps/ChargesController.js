'use strict';

const path = require('path');

const chargeService = make(
  'App/Services/Caregiver/OnboardingSteps/ChargeService',
);
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

class ChargesController {
  /**
   * Name: Jainam Shah
   * Purpose: get charges and bank data for caregiver
   * Params: request, response
   * */
  async getChargesData({ request, response }) {
    try {
      const caregiver = request.caregiver;

      // get all charges and bank details for caregiver
      const data = await chargeService.getCharges(caregiver.id);

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
   * Purpose: add / update charges for caregiver
   * Params: request, response
   * */
  async addUpdateCharges({ request, response }) {
    try {
      const reqData = await request.all();
      const caregiver = request.caregiver;

      await chargeService.addUpdateCharges(caregiver, reqData);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.CHARGES_ADDED,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const duplicateErrorRes = message.ER_DUP_ENTRY;
        duplicateErrorRes.message = `Price for ${
          error.sqlMessage.split('-')[1].split('')[0]
        } hour is already added for this caregiver, try to update that.`;
        return util.sendErrorResponse(response, duplicateErrorRes);
      }
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = ChargesController;
