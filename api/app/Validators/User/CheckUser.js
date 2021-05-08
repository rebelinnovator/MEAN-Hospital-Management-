'use strict';

const util = make('App/Services/Common/UtilService');

class CheckUser {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { user_id: 'to_int' };
  }

  get rules() {
    return { user_id: 'required|integer' };
  }

  get messages() {
    return {
      'user_id.required': 'User ID is required',
      'user_id.integer': 'User ID is required',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = CheckUser;
