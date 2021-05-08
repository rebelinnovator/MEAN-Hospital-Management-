'use strict';

// Libraries
const path = require('path');
const moment = require('moment');

const Env = use('Env');

// Services
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));
const bookingService = make('App/Services/Booking/BookingService');

const bookingStatus = {
  1: 'awaiting_for_response',
  2: 'accepted',
  3: 'rejected',
  4: 'cancelled',
};
const bookingStatusByMsg = {
  awaiting: '1',
  accepted: '2',
  rejected: '3',
  cancelled: '4',
  isCancelled: '1',
};

class BookingActionController {
  /**
   * Name: Nirav Goswami
   * Purpose: accept booking
   * Params: request, response
   * */
  async acceptBooking({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      // check all booking actions before accepting booking
      const msg = await this.checkAcceptBookingActions(
        booking,
        reqData.registration_no,
      );
      if (msg) {
        return await util.sendErrorResponse(response, msg);
      }

      // Checking if caregiver is not booked in this slot
      const isCaregiverFree = await bookingService.checkCaregiverIsFree(
        booking,
        reqData,
        false,
      );
      if (isCaregiverFree.length) {
        return await util.sendErrorResponse(response, message.BOOKED_ALREADY);
      }
      await bookingService.acceptBooking(booking, reqData);

      // sending whatsapp message to CLIENT for acceptance of his request
      await util.sendWhatsAppMessage(
        booking.toJSON().client.user.mobile_number,
        '有護理員已經接受咗上門護理服務邀請喇，麻煩你睇吓電郵（包括垃圾郵件夾）以了解收費同埋付款。',
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: check booking actions before accepting booking
   * Params: booking, registration_no
   * */
  async checkAcceptBookingActions(booking, regNo) {
    let msg = '';

    // check if cancelled by client
    if (
      booking &&
      booking.status == bookingStatusByMsg.cancelled &&
      booking.cancelled_by == bookingStatusByMsg.rejected
    ) {
      return message.BOOKING_CANCELLED_BY_CLIENT;
    }

    if (booking && booking.status !== bookingStatusByMsg.awaiting) {
      msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
      msg.message = `${msg.message} ${bookingStatus[booking.status]}`;
      return msg;
    }

    // booking start time should be at least before 2 hours
    if (booking.start_time) {
      const date = moment(booking.start_time).format('YYYY-MM-DD HH:mm:ss');
      const duration = moment(date).diff(moment(), 'minutes');
      if (duration < Env.get('CAREGIVER_MINUTES')) {
        return message.CAREGIVER_DURATION_ERROR;
      }
    }

    const caregiver = await bookingService.getCaregiver(regNo);

    // Already accepted by caregiver
    let caregiverDetails = await booking.caregiverDetail().fetch();
    caregiverDetails = caregiverDetails.toJSON();
    const checkAccepted = caregiverDetails.filter(
      c => c.status === bookingStatusByMsg.accepted,
    )[0];
    if (checkAccepted) {
      const returnMsg =
        checkAccepted.caregiver_id === caregiver.id
          ? message.BOOKING_ALREADY_ACCEPTED_BY_YOU
          : message.BOOKING_ALREADY_ACCEPTED;
      return returnMsg;
    }

    // Already rejected by same caregiver
    const checkRejected = caregiverDetails.filter(
      c => c.status === bookingStatusByMsg.rejected,
    )[0];
    if (checkRejected && checkRejected.caregiver_id === caregiver.id) {
      const returnMsg = message.BOOKING_ALREADY_REJECTED_BY_YOU;
      return returnMsg;
    }

    // Already cancelled by caregiver
    const checkCancelled = caregiverDetails.find(
      c => c.caregiver_id === caregiver.id,
    );
    if (
      checkCancelled &&
      checkCancelled.is_cancelled &&
      checkCancelled.is_cancelled === bookingStatusByMsg.isCancelled
    ) {
      msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
      msg.message = `${msg.message} ${bookingStatus[4]}`;
      return msg;
    }

    return msg;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: reject booking
   * Params: request, response
   * */
  async rejectBooking({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      // check all booking actions before rejecting booking
      const msg = await this.checkRejectBookingActions(
        booking,
        reqData.registration_no,
      );
      if (msg) {
        return await util.sendErrorResponse(response, msg);
      }

      await bookingService.rejectBooking(booking, reqData);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: check booking actions before rejecting booking
   * Params: booking, registration_no
   * */
  async checkRejectBookingActions(booking, regNo) {
    let msg = '';

    // check if cancelled by client
    if (
      booking &&
      booking.status == bookingStatusByMsg.cancelled &&
      booking.cancelled_by == bookingStatusByMsg.rejected
    ) {
      return message.BOOKING_CANCELLED_BY_CLIENT;
    }

    // check for admin approved / rejected or cancelled
    if (booking && booking.status !== bookingStatusByMsg.awaiting) {
      msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
      msg.message = `${msg.message} ${bookingStatus[booking.status]}`;
      return msg;
    }

    const caregiver = await bookingService.getCaregiver(regNo);

    let caregiverDetails = await booking.caregiverDetail().fetch();
    caregiverDetails = caregiverDetails.toJSON();

    // Already accepted by caregiver
    const checkAccepted = caregiverDetails.filter(
      c => c.status === bookingStatusByMsg.accepted,
    )[0];
    if (checkAccepted && checkAccepted.caregiver_id === caregiver.id) {
      const returnMsg = message.BOOKING_ALREADY_ACCEPTED_BY_YOU;
      return returnMsg;
    }

    // Already rejected by caregiver
    const checkRejected = caregiverDetails.filter(
      c =>
        c.status === bookingStatusByMsg.rejected &&
        c.caregiver_id === caregiver.id,
    )[0];
    if (checkRejected) {
      return message.BOOKING_ALREADY_REJECTED;
    }

    // Already cancelled by caregiver
    const checkCancelled = caregiverDetails.find(
      c => c.caregiver_id === caregiver.id,
    );
    if (
      checkCancelled &&
      checkCancelled.is_cancelled &&
      checkCancelled.is_cancelled === bookingStatusByMsg.isCancelled
    ) {
      msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
      msg.message = `${msg.message} ${bookingStatus[4]}`;
      return msg;
    }

    return msg;
  }

  /**
   * Name: Jainam Shah
   * Purpose: confirm booking by Admin
   * Params: request, response
   * */
  async confirmBooking({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      // check all booking actions before confirming booking
      const msg = await this.checkConfirmBookingActions(booking, reqData);
      if (msg) {
        return await util.sendErrorResponse(response, msg);
      }

      await bookingService.confirmBooking(booking, reqData);

      // sending whatsapp message to CLIENT for service confirmed
      await util.sendWhatsAppMessage(
        booking.toJSON().client.user.mobile_number,
        '多謝！我們已經收到款項。上門護理已獲確認!請睇吓電郵（包括垃圾郵件夾）入面嘅確認電郵。\n\n麻煩你到時提供所需嘅設備(例如：尿片)同埋用品(例如：血壓計)。\n\n如果揀咗陪診員，麻煩你喺屋企預備1)受顧者身分證 2)預約紙 3)覆診費 4)來回的士車資。\n如果服務時數滿8同埋12小時，護理員分別享有30及60分鐘進食時間。\n如果服務喺凌晨12點至早上6：30開始或完結，麻煩你準備額外$150交通費直接俾護理員。',
      );

      const caregiver = await bookingService.getCaregiver(
        reqData.registration_no,
      );

      // sending whatsapp message to CAREGIVER for service confirmed
      await util.sendWhatsAppMessage(
        caregiver.toJSON().user.mobile_number,
        '恭喜，上門護理已獲確認！上門嘅時候，請你穿著長袖衫褲同埋戴上口罩。客戶將會提供所需用品及設備。\n麻煩你睇吓電郵（包括垃圾郵件夾）入面嘅確認電郵。\n\n有關陪診服務，客人會預備往返醫院或者診所嘅交通費。\n如果服務時數滿8同埋12小時，護理員分別享有30及60分鐘進食時間。\n如果服務喺凌晨12點至早上6：30開始或完結，你可向客戶收取$150交通費。',
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: check booking actions before confirming booking
   * Params: booking, reqData
   * */
  async checkConfirmBookingActions(booking, reqData) {
    let msg = '';

    // booking action by client
    if (booking && booking.status !== bookingStatusByMsg.awaiting) {
      msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
      booking.status === bookingStatusByMsg.accepted
        ? (msg.message = 'Booking already confirmed')
        : (msg.message = `${msg.message} ${bookingStatus[booking.status]}`);
      return msg;
    }

    let caregiverDetails = await booking.caregiverDetail().fetch();
    caregiverDetails = caregiverDetails.toJSON();

    // booking not accepted yet
    const checkAccepted = caregiverDetails.find(
      c => c.id === reqData.caregiver_booking_details_id,
    );
    if (checkAccepted && checkAccepted.status !== bookingStatusByMsg.accepted) {
      return message.BOOKED_NOT_ACCEPTED_YET;
    }

    // booking already cancelled by caregiver
    if (
      checkAccepted &&
      checkAccepted.is_cancelled &&
      checkAccepted.is_cancelled === bookingStatusByMsg.isCancelled
    ) {
      msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
      msg.message = `${msg.message} ${bookingStatus[4]} by caregiver`;
      return msg;
    }

    // Checking if caregiver is not booked in this slot
    const isCaregiverFree = await bookingService.checkCaregiverIsFree(
      booking,
      reqData,
      true,
    );
    if (isCaregiverFree.length) {
      return message.CG_BOOKED_ALREADY;
    }

    return msg;
  }

  /**
   * Name: Jainam Shah
   * Purpose: cancle booking by Client
   * Params: request, response
   * */
  async cancelBookingByClient({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      // Already cancelled
      if (booking && booking.status === bookingStatusByMsg.cancelled) {
        const msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
        msg.message = `${msg.message} ${bookingStatus[4]}`;
        return await util.sendErrorResponse(response, msg);
      }

      // Already confirmed -> payment completed
      if (booking && booking.status === bookingStatusByMsg.accepted) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_ALREADY_CONFIRMED,
        );
      }

      await bookingService.cancelBookingByClient(booking, reqData);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.BOOKING_CANCELLED_SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: cancle booking by Client
   * Params: request, response
   * */
  async cancelBookingByCaregiver({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      // Already cancelled by caregiver
      const caregiver = await bookingService.getCaregiver(
        reqData.registration_no,
      );
      let caregiverDetails = await booking.caregiverDetail().fetch();
      caregiverDetails = caregiverDetails.toJSON();
      const checkAccepted = caregiverDetails.find(
        c => c.caregiver_id === caregiver.id,
      );
      if (
        checkAccepted &&
        checkAccepted.is_cancelled &&
        checkAccepted.is_cancelled === bookingStatusByMsg.isCancelled
      ) {
        const msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
        msg.message = `${msg.message} ${bookingStatus[4]}`;
        return await util.sendErrorResponse(response, msg);
      }
      if (
        checkAccepted &&
        checkAccepted.status !== bookingStatusByMsg.accepted
      ) {
        return await util.sendErrorResponse(
          response,
          message.BOOKED_NOT_ACCEPTED_YET,
        );
      }

      await bookingService.cancelBookingByCaregiver(booking, reqData);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: cancle booking by Admin
   * Params: request, response
   * */
  async cancelBookingByAdmin({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      // Already cancelled by Admin
      if (booking && booking.status === bookingStatusByMsg.cancelled) {
        const msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
        msg.message = `${msg.message} ${bookingStatus[booking.status]}`;
        return await util.sendErrorResponse(response, msg);
      }

      await bookingService.cancelBookingByAdmin(booking, reqData);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Nirav Goswami
   * Purpose: Change booking date by Admin
   * Params: request, response
   * */
  async changeBookingTime({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      // Only admin confirmed bookings date can be change
      if (booking && booking.status !== bookingStatusByMsg.accepted) {
        const msg = JSON.parse(JSON.stringify(message.BOOKING_ALREADY_UPDATED));
        msg.message = `${msg.message} ${bookingStatus[booking.status]}`;
        return await util.sendErrorResponse(response, msg);
      }

      const startTime = moment(`${reqData.date} ${reqData.start_time}`).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      let endTime = moment(startTime)
        .add(booking.duration, 'hours')
        .format('YYYY-MM-DD HH:mm:ss');
      booking.date = startTime;
      booking.start_time = startTime;
      booking.end_time = endTime;

      if (endTime.split(' ')[1] == '00:00:00') {
        endTime = moment(endTime)
          .subtract('1', 'minutes')
          .format('YYYY-MM-DD HH:mm:ss');
      }

      const startDateMoment = moment(startTime, 'YYYY-MM-DD HH:mm:ss');
      const endDateMoment = moment(endTime, 'YYYY-MM-DD HH:mm:ss');
      if (!startDateMoment.isSame(endDateMoment, 'date')) {
        return await util.sendErrorResponse(
          response,
          message.END_TIME_DIFF_DATE,
        );
      }

      await booking.save();

      await bookingService.sendDateChangeMail(booking);

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = BookingActionController;
