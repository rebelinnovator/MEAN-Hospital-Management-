'use strict';

const path = require('path');
const moment = require('moment');

const Mail = use('Mail');
const Env = use('Env');

const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

const bookingService = make('App/Services/Booking/BookingService');
const clientService = make('App/Services/Client/ClientService');
const caregiverService = make('App/Services/Caregiver/CaregiverService');

const language = {
  Chinese: '1',
  English: '2',
};
const PAID = '2';

class BookingController {
  /**
   * Name: Jainam Shah
   * Purpose: get open booking count for a client
   * Params: request, response
   * */
  async getOpenClientBookings({ request, response }) {
    try {
      const reqData = await request.all();
      const client = await clientService.checkClientBySlug(reqData.slug);
      if (!client) {
        return await util.sendErrorResponse(response, message.CLIENT_NOT_FOUND);
      }

      const activeBookings = await bookingService.getActiveBooking(client.id);
      const data = { total_active_bookings: activeBookings };
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
   * Name: Nirav Goswami
   * Purpose: add booking
   * Params: response
   * */
  async addBooking({ request, response }) {
    try {
      const reqData = await request.all();
      const client = await clientService.checkClientBySlug(reqData.slug);
      if (!client) {
        return await util.sendErrorResponse(response, message.CLIENT_NOT_FOUND);
      }
      if (client && client.current_step !== null) {
        return await util.sendErrorResponse(
          response,
          message.PROFILE_NOT_COMPLETED,
        );
      }

      const activeBookings = await bookingService.getActiveBooking(client.id);
      if (activeBookings && activeBookings >= 5) {
        return await util.sendErrorResponse(
          response,
          message.MAX_BOOKING_REACHED,
        );
      }

      // booking start time should be at least after 6 hours
      if (reqData.start_time) {
        reqData.date = moment(reqData.date).format('YYYY-MM-DD');
        const input = `${reqData.date} ${reqData.start_time}`;
        const utcDateTime = moment(input).format('YYYY-MM-DD HH:mm:ss');
        reqData.start_time = utcDateTime;
        const duration = moment(reqData.start_time).diff(moment(), 'minutes');
        if (duration < Env.get('CLIENT_MINUTES')) {
          return await util.sendErrorResponse(
            response,
            message.CLIENT_DURATION_ERROR,
          );
        }
      }
      if (reqData.end_time) {
        const input = `${reqData.date} ${reqData.end_time}`;
        const utcDateTime = moment(input).format('YYYY-MM-DD HH:mm:ss');
        reqData.end_time = utcDateTime;
      }

      const startTime = moment(reqData.start_time, 'YYYY-MM-DD HH:mm:ss');
      const endTime = moment(reqData.end_time, 'YYYY-MM-DD HH:mm:ss');
      if (startTime >= endTime) {
        return await util.sendErrorResponse(
          response,
          message.END_TIME_GT_START_TIME,
        );
      }

      reqData.client_id = client.id;
      const data = await bookingService.addBooking(reqData);
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
   * Name: Nirav Goswami
   * Purpose: get booking for client upcoming / past
   * Params: response
   * */
  async getBookingForClient({ request, response }) {
    try {
      const reqData = await request.all();
      const client = await clientService.checkClientBySlug(reqData.slug);
      if (!client) {
        return await util.sendErrorResponse(response, message.CLIENT_NOT_FOUND);
      }

      const bookingData = await bookingService.getBookingForCareOrClient(
        client,
        reqData,
        'client',
      );

      const data = util.createPagination(
        bookingData.count,
        bookingData.pageNumber,
        bookingData.recordPerPage,
        bookingData.bookings,
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

  /**
   * Name: Jainam Shah
   * Purpose: get booking for caregiver upcoming / past
   * Params: response
   * */
  async getBookingForCaregiver({ request, response }) {
    try {
      const reqData = await request.all();
      const caregiver = await caregiverService.checkCaregiver(
        reqData.registration_no,
      );
      if (!caregiver) {
        return await util.sendErrorResponse(
          response,
          message.CAREGIVER_NOT_FOUND,
        );
      }

      const bookingData = await bookingService.getBookingForCareOrClient(
        caregiver,
        reqData,
        'caregiver',
      );

      const data = util.createPagination(
        bookingData.count,
        bookingData.pageNumber,
        bookingData.recordPerPage,
        bookingData.bookings,
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

  /**
   * Name: Jainam Shah
   * Purpose: caregiver payment by admin
   * Params: response
   * */
  async caregiverPayment({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      if (booking.payment_status_caregiver === PAID) {
        return await util.sendErrorResponse(
          response,
          message.ALREADY_PAID_CAREGIVER,
        );
      }

      const caregiver = await bookingService.getCaregiver(
        reqData.registration_no,
      );

      const mailData = { email: caregiver.toJSON().user.email };

      // Sending mail to CAREGIVER for payment received (Paid)
      Mail.send(
        caregiver.toJSON().user.preferred_communication_language ===
          language.Chinese
          ? 'email.ch.paid-by-admin-caregiver'
          : 'email.en.paid-by-admin-caregiver',
        mailData,
        mail => {
          mail
            .to(mailData.email)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              caregiver.toJSON().user.preferred_communication_language ===
                language.Chinese
                ? '已入數'
                : 'Paid',
            );
        },
      );

      // sending whatsapp message to CAREGIVER for payment received (Paid)
      await util.sendWhatsAppMessage(
        caregiver.toJSON().user.mobile_number,
        '岩岩已經過左數比你啦! 麻煩你睇下銀行户口確認啦!',
      );
      booking.payment_status_caregiver = reqData.payment_status_caregiver;
      booking.payment_date_caregiver = reqData.payment_date_caregiver;
      booking.save();

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.CAREGIVER_PAYMENT,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: get booking details for a booking (Admin)
   * Params: request, response
   * */
  async getBookingDetails({ request, response }) {
    try {
      const reqData = await request.all();
      const booking = await bookingService.checkBooking(reqData);
      if (!booking) {
        return await util.sendErrorResponse(
          response,
          message.BOOKING_NOT_FOUND,
        );
      }

      const data = booking;

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

module.exports = BookingController;
