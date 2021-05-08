'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class AddUpdateAccountUserInfo {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      first_name: 'escape',
      last_name: 'escape',
      home_telephone_number: 'escape',
      mobile_number: 'escape',
    };
  }

  get rules() {
    return {
      user_id: 'required|integer',
      salute: [rule('required'), rule('in', ['1', '2'])],
      first_name: 'required',
      last_name: 'required',
      email: 'required|email|max:255',
      home_telephone_number: 'required',
      mobile_number: 'required',
      preferred_communication_language: [
        rule('required'),
        rule('in', ['1', '2']),
      ],
      relation_with_service_user: [rule('in', ['1', '2', '3', '4', '5'])],
    };
  }

  get messages() {
    return {
      'user_id.required': 'User ID is required.',
      'user_id.integer': 'User ID is required.',
      'salute.required': 'Salute is required.',
      'salute.in': 'Salute should be in {{argument}}.',
      'first_name.required': 'First name is required.',
      'last_name.required': 'Last name is required.',
      'email.required': 'Email is required.',
      'email.email': 'Please enter a valid email address.',
      'home_telephone_number.required': 'Home telephone number is required.',
      'mobile_number.required': 'Mobile number is required.',
      'preferred_communication_language.required':
        'Preferred language of communication is required.',
      'preferred_communication_language.in':
        'Preferred language of communication should be in {{ argument }}.',
      'relation_with_service_user.in':
        'Your relation with service user should be in {{ argument }}.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateAccountUserInfo;
