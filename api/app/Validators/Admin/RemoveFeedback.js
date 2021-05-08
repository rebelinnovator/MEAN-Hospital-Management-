'use strict';

const util = make('App/Services/Common/UtilService');

class RemoveFeedback {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {};
  }

  get rules() {
    return { id: 'required|integer' };
  }

  get messages() {
    return {
      'id.required': 'id is required',
      'id.integer': 'id must be integer',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = RemoveFeedback;
