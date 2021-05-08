'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class ChangeBookingTime {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {};
  }

  get rules() {
    return {
      booking_id: 'required',
      date: [rule('required'), rule('dateFormat', 'YYYY-MM-DD')],
      start_time: [rule('required'), rule('regex', /([0-1][0-9]|2[0-3])/)],
    };
  }

  get messages() {
    return {
      'booking_id.required': 'Booking ID is required',
      'date.required': 'Date is required',
      'date.dateFormat': 'Please enter valid Date e.g. {{argument}}',
      'start_time.required': 'Start Time is required',
      'start_time.regex': 'Please enter valid Start Time.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = ChangeBookingTime;
