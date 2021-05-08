'use strict';

const util = make('App/Services/Common/UtilService');

class ForgotPassword {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { email: 'normalize_email' };
  }

  get rules() {
    return { email: 'required|email' };
  }

  get messages() {
    return {
      'email.required': 'Email address is required.',
      'email.email': 'Please enter a valid email address.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = ForgotPassword;
