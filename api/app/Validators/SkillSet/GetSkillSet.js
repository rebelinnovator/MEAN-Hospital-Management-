'use strict';

const util = make('App/Services/Common/UtilService');

class GetSkillSet {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { caregiver_type: 'to_int' };
  }

  get rules() {
    return { caregiver_type: 'required|integer' };
  }

  get messages() {
    return {
      'caregiver_type.required': 'Caregiver type is required',
      'caregiver_type.integer': 'Caregiver type is required',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = GetSkillSet;
