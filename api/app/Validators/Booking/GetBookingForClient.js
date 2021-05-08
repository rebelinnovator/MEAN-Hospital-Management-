'use strict';

const util = make('App/Services/Common/UtilService');

class GetBookingForClient {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { slug: 'trim' };
  }

  get rules() {
    return {
      slug: 'required',
      appointment: 'required|in:upcoming,past',
      upcomingStatus: 'required_when:appointment,upcoming|in:confirmed,pending',
      pendingStatus: 'required_when:appointment,past|in:completed,cancelled',
    };
  }

  get messages() {
    return {
      'slug.required': 'Slug is required',
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

module.exports = GetBookingForClient;
