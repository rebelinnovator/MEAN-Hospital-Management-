'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class OutstandingAppointment {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      recordPerPage: 'to_int',
      pageNumber: 'to_int',
      orderBy: 'escape',
    };
  }

  get rules() {
    return {
      recordPerPage: 'integer',
      pageNumber: 'integer',
      orderBy: 'string',
      orderDir: 'in:asc,desc',
      mobile_number: 'integer',
      email: 'email|max:255',
      status: [rule('in', ['1', '2', '3', '4'])],
      caregiver_status: [rule('in', ['1', '2', '3'])],
      start_time: 'date',
      end_time: 'date',
      requiredCSV: 'boolean',
      isAcceptedByCaregiver: [rule('in', ['one', 'none'])],
    };
  }

  get messages() {
    return {
      'recordPerPage.integer': 'Record per page must be in integer.',
      'pageNumber.integer': 'Page number must be in integer.',
      'orderBy.string': 'Order by must be a string value.',
      'orderDir.in': 'Order direction must be either asc or desc.',
      'mobile_number.integer': 'Mobile number should be in number.',
      'email.email': 'Please enter a valid email address.',
      'status.string': 'Status must be string value',
      'caregiver_status.string': 'caregiver_status must be string value',
      'start_time.date': 'start_time muse be a date',
      'end_time.date': 'end_time muse be a date',
      'requiredCSV.boolean': 'Required CSV must be a boolean value.',
      'isAcceptedByCaregiver.in':
        'Accepted by caregiver should be either one or none',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = OutstandingAppointment;
