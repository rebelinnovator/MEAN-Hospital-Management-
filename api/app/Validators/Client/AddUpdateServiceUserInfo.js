'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class AddUpdateAccountUserInfo {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      slug: 'escape',
      service_user_firstname: 'escape',
      service_user_lastname: 'escape',
      servive_user_home_telephone: 'escape',
      service_user_mobile: 'escape',
      service_user_flat_no: 'escape',
      service_user_floor_no: 'escape',
      service_user_building_name: 'escape',
      service_user_street_name_number: 'escape',
      service_user_district: 'escape',
    };
  }

  get rules() {
    return {
      slug: 'required',
      service_user_salute: [rule('required'), rule('in', ['1', '2'])],
      service_user_firstname: 'required',
      service_user_lastname: 'required',
      service_user_dob: [rule('dateFormat', 'YYYY-MM-DD')],
      servive_user_home_telephone: 'required',
      service_user_mobile: 'required',
      service_user_flat_no: 'required',
      service_user_floor_no: 'required',
      service_user_building_name: 'required',
      service_user_street_name_number: 'required',
      service_user_district: 'required',
    };
  }

  get messages() {
    return {
      'slug.required': 'Slug is required.',
      'service_user_salute.required': 'Salute is required.',
      'service_user_salute.in': 'Salute should be in {{argument}}.',
      'service_user_firstname.required': 'First name is required.',
      'service_user_lastname.required': 'Last name is required.',
      'service_user_dob.dateFormat': 'Please enter valid Date of birth',
      'servive_user_home_telephone.required':
        'Home telephone number is required.',
      'service_user_mobile.required': 'Mobile number is required.',
      'service_user_flat_no.required': 'Flat is required.',
      'service_user_floor_no.required': 'Floor is required.',
      'service_user_building_name.required': 'Building is required.',
      'service_user_street_name_number.required':
        'Street name and number is required.',
      'service_user_district.required': 'District is required.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateAccountUserInfo;
