'use strict';

const util = make('App/Services/Common/UtilService');

class AddUpdateSkillSet {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { registration_no: 'to_int', self_introduction: 'escape' };
  }

  get rules() {
    return {
      'registration_no': 'required',
      'skills': 'required|array',
      'skills.*': 'number',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'skills.required': 'Skills are required.',
      'skills.array': 'Skills should be an array.',
      'skills.*.number': 'All values for skills should be number.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateSkillSet;
