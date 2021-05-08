'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class ChangeCaregiverStatus {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {};
  }

  get rules() {
    return {
      'caregiver': 'required|array',
      'caregiver.*.id': 'required',
      'caregiver.*.status': [rule('required'), rule('in', ['2', '3'])],
    };
  }

  get messages() {
    return {
      'caregiver.required': 'Caregiver is required.',
      'caregiver.array': 'Caregiver should be an array.',
      'caregiver.*.id.required': 'id is required.',
      'caregiver.*.status.required': 'status is required.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = ChangeCaregiverStatus;
