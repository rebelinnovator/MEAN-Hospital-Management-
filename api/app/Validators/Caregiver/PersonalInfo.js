'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class PersonalInfo {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      registration_no: 'to_int',
      email: 'normalize_email',
      refferers_email: 'normalize_email',
      nick_name: 'escape',
      chinese_name: 'escape',
      english_name: 'escape',
    };
  }

  get rules() {
    return {
      'registration_no': 'required',
      'nick_name': 'required',
      'salute': [rule('required'), rule('in', ['1', '2'])],
      'email': 'required|email|max:255',
      'dob': [rule('dateFormat', 'YYYY-MM-DD')],
      'caregiver_type': [
        rule('required'),
        rule('in', ['1', '2', '3', '4', '5']),
      ],
      'mobile_number': 'integer',
      'refferers_email': 'email|different:email',
      'languages.*.language': 'required',
      // 'languages.*.other_lang': 'required_when:languages.*.language,4',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'nick_name.required': 'Nickname is required.',
      'salute.required': 'Salute is required.',
      'salute.in': 'Salute should be either 1 or 2.',
      'email.required': 'Email is required.',
      'email.email': 'Please enter a valid email address.',
      'dob.dateFormat': 'Please enter valid Date of birth',
      'caregiver_type.required': 'Caregiver type is required.',
      'caregiver_type.in': 'Caregiver should be in 1 to 5.',
      'languages.*.language': 'Language is required.',
      'languages.*.other_lang': 'Other language is required.',
      'mobile_number.integer': 'Mobile number should be in number.',
      'refferers_email.email': 'Please enter a valid refferers email address.',
      'refferers_email.different':
        'Email and refferes email should be different.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = PersonalInfo;
