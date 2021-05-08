'use strict';

const util = make('App/Services/Common/UtilService');

class TermsAndConditions {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { registration_no: 'to_int', hkid_name: 'escape' };
  }

  get rules() {
    return {
      registration_no: 'required',
      hkid_name: 'required',
      tnc_accepted_date: 'required|date',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'hkid_name.required': 'HKID full name is required.',
      'tnc_accepted_date.required': 'Date is required.',
      'tnc_accepted_date.date': 'Invalid date format.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = TermsAndConditions;
