'use strict';

const util = make('App/Services/Common/UtilService');

class CancelBookingByClient {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { slug: 'trim|escape', booking_id: 'escape' };
  }

  get rules() {
    return {
      slug: 'required',
      booking_id: 'required',
    };
  }

  get messages() {
    return {
      'slug.required': 'Slug is required.',
      'booking_id.required': 'Booking ID is required.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = CancelBookingByClient;
