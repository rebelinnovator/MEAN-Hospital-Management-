'use strict';

const util = make('App/Services/Common/UtilService');

class Login {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { email: 'normalize_email', password: 'escape' };
  }

  get rules() {
    return {
      email: 'required|email|max:255',
      password: 'required|min:6|max:30',
      user_type: 'required|in:1,2,3',
    };
  }

  get messages() {
    return {
      'email.required': 'Email address is required.',
      'email.email': 'Please enter a valid email address.',
      'password.required': 'Password is required.',
      'user_type.required': 'User type is required.',
      'user_type.in': 'Please enter a valid user type.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = Login;
