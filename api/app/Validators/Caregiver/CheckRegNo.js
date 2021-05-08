'use strict';

const util = make('App/Services/Common/UtilService');

class CheckRegNo {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { registration_no: 'to_int' };
  }

  get rules() {
    return { registration_no: 'required|integer' };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required',
      'registration_no.integer': 'Caregiver is required',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = CheckRegNo;
