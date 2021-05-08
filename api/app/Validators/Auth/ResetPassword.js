'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class ResetPassword {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      token: 'escape',
      password: 'escape',
    };
  }

  get rules() {
    return {
      token: 'required',
      password: [
        rule('required'),
        rule('regex', /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}/),
      ],
    };
  }

  get messages() {
    return {
      'token.required': 'Token is required.',
      'password.required': 'Password is required.',
      'password.regex':
        'Password must be 6 characters long, at least 1 capital character, at least 1 numeric character.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = ResetPassword;
