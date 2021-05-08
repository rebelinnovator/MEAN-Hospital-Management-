'use strict';

const util = make('App/Services/Common/UtilService');

class GetReferralBonus {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      slug: 'escape',
      registration_no: 'escape',
    };
  }

  get rules() {
    return {
      for: 'required|in:client,caregiver',
      slug: 'required_when:for,client',
      registration_no: 'required_when:for,caregiver',
    };
  }

  get messages() {
    return {
      'for.required': 'For is required',
      'for.in': 'For should be in {{argument}}',
      'slug.required_when': 'Client is required',
      'registration_no.required_when': 'Caregiver is required',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = GetReferralBonus;
