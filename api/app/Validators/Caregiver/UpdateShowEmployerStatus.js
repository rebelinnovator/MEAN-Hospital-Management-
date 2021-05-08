'use strict';

const util = make('App/Services/Common/UtilService');

class UpdateShowEmployerStatus {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { registration_no: 'to_int', show_employer_option: 'escape' };
  }

  get rules() {
    return {
      registration_no: 'required',
      show_employer_option: 'required',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'show_employer_option.required': 'Show Employer Option is required.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = UpdateShowEmployerStatus;
