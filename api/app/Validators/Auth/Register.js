'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class Register {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { email: 'normalize_email', password: 'escape' };
  }

  get rules() {
    return {
      email: 'required|email|max:255|unique:users',
      password: [
        rule('required'),
        rule('regex', /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}/),
      ],
      user_type: 'required|in:2,3',
    };
  }

  get messages() {
    return {
      'email.required': 'Email address is required.',
      'email.email': 'Please enter a valid email address.',
      'email.unique': 'This email address is already registered.',
      'password.required': 'Password is required.',
      'password.regex':
        'Password must be 6 characters long, at least 1 capital character, at least 1 numeric character.',
      'user_type.required': 'User type is required.',
      'user_type.in': 'Please enter a valid user type.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = Register;
