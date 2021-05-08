'use strict';

const util = make('App/Services/Common/UtilService');

class CancelBookingByAdmin {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { booking_id: 'escape' };
  }

  get rules() {
    return { booking_id: 'required' };
  }

  get messages() {
    return { 'booking_id.required': 'Booking ID is required' };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = CancelBookingByAdmin;
