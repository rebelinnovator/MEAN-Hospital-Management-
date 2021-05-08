'use strict';

// Libraries
const path = require('path');
const moment = require('moment');

// Services
const message = require(path.resolve('app/Constants/Response/index'));
const caregiverService = make('App/Services/Caregiver/CaregiverService');

// Constants
const util = make('App/Services/Common/UtilService');

class CaregiverController {
  /**
   * Name: Jainam Shah
   * Purpose: get profile overview for caregiver
   * Params: request, response
   * */
  async getProfileOverview({ request, response }) {
    try {
      const reqData = await request.all();

      // check if caregiver exists or not
      const caregiver = await caregiverService.checkCaregiver(
        reqData.registration_no,
      );
      if (!caregiver) {
        return await util.sendErrorResponse(
          response,
          message.CAREGIVER_NOT_FOUND,
        );
      }

      // get caregivers data for profile overview
      const data = await caregiverService.getProfileOverview(caregiver.id);

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
   * Purpose: get profile info for caregiver
   * Params: request, response
   * */
  async getProfileInfo({ request, response }) {
    try {
      const reqData = await request.all();

      // check if caregiver exists or not
      const caregiver = await caregiverService.checkCaregiver(
        reqData.registration_no,
      );
      if (!caregiver) {
        return await util.sendErrorResponse(
          response,
          message.CAREGIVER_NOT_FOUND,
        );
      }

      // get caregivers data for profile overview
      const data = await caregiverService.getProfileInfo(caregiver.id);

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
   * Purpose: To search for a caregiver and send approriated / related data
   * Params: request, response
   * */
  async searchCaregiver({ request, response }) {
    try {
      const reqData = await request.all();

      if (reqData.date && reqData.from_time && reqData.to_time) {
        const startTime = moment(`${reqData.date} ${reqData.from_time}`, 'YYYY-MM-DD HH:mm:ss');
        const endTime = moment(`${reqData.date} ${reqData.to_time}`, 'YYYY-MM-DD HH:mm:ss');
        if (startTime >= endTime) {
          return await util.sendErrorResponse(
            response,
            message.END_TIME_GT_START_TIME,
          );
        }
      }


      // get caregivers data for profile overview
      const caregiversData = await caregiverService.getCaregivers(reqData);

      const data = util.createPagination(
        caregiversData.count,
        caregiversData.pageNumber,
        caregiversData.recordPerPage,
        caregiversData.caregivers,
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async getAllFeedbacks({ request, response }) {
    try {
      const reqData = await request.all();
      // check if caregiver exists or not
      const caregiver = await caregiverService.checkCaregiver(
        reqData.registration_no,
      );
      if (!caregiver) {
        return await util.sendErrorResponse(
          response,
          message.CAREGIVER_NOT_FOUND,
        );
      }

      const feedbackData = await caregiverService.getAllFeedbacks(
        reqData,
        caregiver,
      );

      const data = util.createPagination(
        feedbackData.count,
        feedbackData.pageNumber,
        feedbackData.recordPerPage,
        feedbackData.clientfeedback,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  // ---------------------------admin side--------------------------------------------
  async getAllCaregivers({ request, response }) {
    try {
      const reqData = await request.all();

      // get all caregivers
      const caregiversData = await caregiverService.getAllCaregivers(reqData);
      const data = reqData.requiredCSV
        ? caregiversData
        : util.createPagination(
          caregiversData.count,
          caregiversData.pageNumber,
          caregiversData.recordPerPage,
          caregiversData.caregivers,
        );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async changeStatus({ request, response }) {
    try {
      const reqData = await request.all();

      await caregiverService.changeStatus(reqData.caregiver);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = CaregiverController;
