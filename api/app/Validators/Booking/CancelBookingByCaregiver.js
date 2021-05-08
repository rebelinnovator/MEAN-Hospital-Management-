'use strict';

const util = make('App/Services/Common/UtilService');

class CancelBookingByCaregiver {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      slug: 'trim|escape',
      registration_no: 'escape',
      booking_id: 'escape',
    };
  }

  get rules() {
    return {
      registration_no: 'required',
      booking_id: 'required',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'booking_id.required': 'Booking ID is required.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = CancelBookingByCaregiver;
