'use strict';

const util = make('App/Services/Common/UtilService');

class BookingActionByCaregiver {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { registration_no: 'to_int', booking_id: 'escape' };
  }

  get rules() {
    return {
      registration_no: 'required|integer',
      booking_id: 'required',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required',
      'registration_no.integer': 'Caregiver is required',
      'booking_id.required': 'Booking ID is required',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = BookingActionByCaregiver;
