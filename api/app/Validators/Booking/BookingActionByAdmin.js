'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class BookingActionByAdmin {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      registration_no: 'to_int',
      caregiver_booking_details_id: 'to_int',
    };
  }

  get rules() {
    return {
      registration_no: 'required|integer',
      booking_id: 'required',
      caregiver_booking_details_id: 'required',
      payment_date_client: [
        rule('required'),
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss'),
      ],
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required',
      'registration_no.integer': 'Caregiver is required',
      'booking_id.required': 'Booking ID is required',
      'caregiver_booking_details_id.required': 'Booking Detail ID is required',
      'payment_date_client.required': 'Payment date is required.',
      'payment_date_client.dateFormat':
        'Payment date format should be YYYY-MM-DD HH:mm:ss.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = BookingActionByAdmin;
