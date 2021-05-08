'use strict';

const util = make('App/Services/Common/UtilService');

class AddUpdateServiceUserMedHistory {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      'slug': 'escape',
      'service_user_other_medical_history': 'escape',
      'illnesses.*.specific_title': 'escape',
    };
  }

  get rules() {
    return {
      'slug': 'required',
      'illnesses': 'array',
      'illnesses.*.illness_id': 'number',
    };
  }

  get messages() {
    return {
      'slug.required': 'Slug is required.',
      'illnesses.array': 'Illness should be an array.',
      'illnesses.*.illness_id.number':
        'All values for illness_id should be number.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateServiceUserMedHistory;
