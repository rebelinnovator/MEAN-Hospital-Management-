'use strict';

const util = make('App/Services/Common/UtilService');

class GetBookingForCaregiver {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { registration_no: 'to_int' };
  }

  get rules() {
    return {
      registration_no: 'required|integer',
      appointment: 'required|in:upcoming,past',
      upcomingStatus: 'required_when:appointment,upcoming|in:confirmed,pending',
      pendingStatus: 'required_when:appointment,past|in:completed,cancelled',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required',
      'registration_no.integer': 'Caregiver is required',
      'appointment.required': 'Appointment is required',
      'appointment.in': 'Appointment should be either upcoming or past',
      'upcomingStatus.required_when': 'Upcoming appointment status is required',
      'upcomingStatus.in':
        'Upcoming status should be either confirmed or pending',
      'pendingStatus.required_when': 'Pending appointment status is required',
      'pendingStatus.in':
        'Pending status should be either completed or cancelled',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = GetBookingForCaregiver;
