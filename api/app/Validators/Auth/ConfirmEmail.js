'use strict';

const util = make('App/Services/Common/UtilService');

class ConfirmEmail {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { token: 'escape' };
  }

  get rules() {
    return { token: 'required' };
  }

  get messages() {
    return { 'token.required': 'Token is required.' };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = ConfirmEmail;
