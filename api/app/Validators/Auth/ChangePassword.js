'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class ChangePassword {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      registration_no: 'to_int',
      slug: 'escape',
      password: 'escape',
    };
  }

  get rules() {
    return {
      user_type: 'required|in:1,2,3',
      id: 'required_when:user_type,1',
      registration_no: 'required_when:user_type,2',
      slug: 'required_when:user_type,3',
      old_password: 'required|min:6|max:30',
      password: [
        rule('required'),
        rule('regex', /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}/),
        rule('different', 'old_password'),
      ],
    };
  }

  get messages() {
    return {
      'user_type.required': 'User type is required.',
      'user_type.in': 'User type is should be in {{argument}}.',
      'id.required_when': 'User is required.',
      'registration_no.required_when': 'Caregiver is required.',
      'slug.required_when': 'Client is required.',
      'old_password.required': 'You must provide existing password.',
      'password.required': 'You must provide a password.',
      'password.regex':
        'Password must be 6 characters long, at least 1 capital character, at least 1 numeric character.',
      'password.different': 'Old password and new password cannot be same.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = ChangePassword;
