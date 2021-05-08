const HttpStatusCode = require('http-status-codes');

const messages = {
  BOOKING_NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND,
    message: 'Booking not found',
  },
  BOOKING_ALREADY_UPDATED: {
    status: HttpStatusCode.CONFLICT,
    message: 'Booking already',
  },

  CAREGIVER_NOT_ACCEPTED_YOUR_BOOKING: {
    status: HttpStatusCode.CONFLICT,
    message: 'caregivers not accepted your booking',
  },

  BOOKING_ALREADY_ACCEPTED: {
    status: HttpStatusCode.CONFLICT,
    message: 'Booking already accepted by the caregiver',
  },

  BOOKING_ALREADY_ACCEPTED_BY_YOU: {
    status: HttpStatusCode.CONFLICT,
    message: 'You have already accepted this booking',
  },

  BOOKING_ALREADY_REJECTED: {
    status: HttpStatusCode.CONFLICT,
    message: 'Booking already rejected by the caregiver',
  },

  BOOKING_ALREADY_REJECTED_BY_YOU: {
    status: HttpStatusCode.CONFLICT,
    message: 'You have already rejected this booking',
  },

  BOOKED_ALREADY: {
    status: HttpStatusCode.CONFLICT,
    message: 'Sorry, you are already booked for this duration',
  },

  CG_BOOKED_ALREADY: {
    status: HttpStatusCode.CONFLICT,
    message: 'Sorry, Caregiver is already booked for this duration',
  },
  BOOKED_NOT_ACCEPTED_YET: {
    status: HttpStatusCode.CONFLICT,
    message: 'Booking for this service is not accepted by the caregiver yet',
  },

  CLIENT_DURATION_ERROR: {
    status: HttpStatusCode.CONFLICT,
    message:
      'In order to help the caregiver get prepared, please book at least 6 hours before the service starts!',
  },

  CAREGIVER_DURATION_ERROR: {
    status: HttpStatusCode.CONFLICT,
    message: "Sorry, It's too late you can't accept this service request now!",
  },

  BOOKING_ALREADY_CONFIRMED: {
    status: HttpStatusCode.CONFLICT,
    message: 'You cannot cancel this service as it is already confirmed.',
  },

  CAREGIVER_PAYMENT: {
    status: HttpStatusCode.OK,
    message: 'Caregiver payment updated successfully.',
  },

  ALREADY_PAID_CAREGIVER: {
    status: HttpStatusCode.CONFLICT,
    message: 'You have already paid to this caregiver.',
  },

  BOOKING_CANCELLED_SUCCESS: {
    status: HttpStatusCode.OK,
    message: 'Your appointment cancelled successfully.',
  },
  BOOKING_CANCELLED_BY_CLIENT: {
    status: HttpStatusCode.CONFLICT,
    message:
      "Sorry, you can't accept or decline the appointment, as the client cancelled it",
  },
  END_TIME_GT_START_TIME: {
    status: HttpStatusCode.BAD_REQUEST,
    message: HttpStatusCode.getStatusText(HttpStatusCode.BAD_REQUEST),
    data: [
      {
        message: 'End time must be greater then start time.',
        field: 'end_time',
      },
    ],
  },
  END_TIME_DIFF_DATE: {
    status: HttpStatusCode.BAD_REQUEST,
    message: 'Your service must be completed on the same date.',
  },
};

module.exports = messages;
