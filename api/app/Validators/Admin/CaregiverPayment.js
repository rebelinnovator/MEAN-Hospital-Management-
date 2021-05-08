'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class CaregiverPayment {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {};
  }

  get rules() {
    return {
      booking_id: 'required',
      payment_status_caregiver: [
        rule('required'),
        rule('in', ['1', '2', '3', '4']),
      ],
      payment_date_caregiver: [
        rule('required'),
        rule('dateFormat', 'YYYY-MM-DD HH:mm:ss'),
      ],
    };
  }

  get messages() {
    return {
      'booking_id.required': 'Booking ID is required',
      'payment_status_caregiver.required': 'Payment Status is required',
      'payment_status_caregiver.in':
        'Payment Status should be in {{ argument }}',
      'payment_date_caregiver.required': 'Payment date is required.',
      'payment_date_caregiver.dateFormat':
        'Payment date format should be YYYY-MM-DD HH:mm:ss.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = CaregiverPayment;
