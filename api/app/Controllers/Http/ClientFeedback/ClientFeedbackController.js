'use strict';

// Libraries
const path = require('path');

// Services
const message = require(path.resolve('app/Constants/Response/index'));
const clientservice = make('App/Services/Client/ClientService');
const bookingService = make('App/Services/Booking/BookingService');
const clientFeedbackService = make(
  'App/Services/ClientFeedback/ClientFeedbackService',
);
// Constants
const util = make('App/Services/Common/UtilService');

const bookingStatusByMsg = {
  awaiting: '1',
  accepted: '2',
  rejected: '3',
  cancelled: '4',
};

class ClientFeedbackController {
  async removeFeedback({ request, response }) {
    try {
      const reqData = await request.all();

      await clientFeedbackService.removeFeedback(reqData, response);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async addFeedback({ request, response }) {
    try {
      const reqData = await request.all();
      const client = await clientservice.checkClientBySlug(reqData.slug);
      if (!client) {
        return await util.sendErrorResponse(response, message.CLIENT_NOT_FOUND);
      }

      let booking = await bookingService.checkBooking(reqData);

      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      let caregiverDetails = await booking.caregiverDetail().fetch();
      booking = booking.toJSON();
      caregiverDetails = caregiverDetails.toJSON();

      const { 0: checkAccepted } = caregiverDetails.filter(
        c => c.status === bookingStatusByMsg.accepted,
      );

      if (!checkAccepted) {
        return await util.sendErrorResponse(
          response,
          message.CAREGIVER_NOT_ACCEPTED_YOUR_BOOKING,
        );
      }

      // check if feedback is already submited
      const alreadySubmited = await clientFeedbackService.checkFeedback(
        booking.id,
      );
      if (alreadySubmited) {
        return await util.sendErrorResponse(
          response,
          message.FEEDBACK_ALREADY_SUBMITTED,
        );
      }

      reqData.caregiver_id = checkAccepted.caregiver_id;
      reqData.booking_id = booking.id;
      reqData.client_id = booking.client_id;
      await clientFeedbackService.addFeedback(reqData, checkAccepted);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.FEEDBACK_SUBMITTED,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}
module.exports = ClientFeedbackController;
