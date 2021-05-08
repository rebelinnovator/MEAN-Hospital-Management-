'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class GetAllCaregivers {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      recordPerPage: 'to_int',
      pageNumber: 'to_int',
      registration_no: 'to_int',
      orderBy: 'escape',
    };
  }

  get rules() {
    return {
      recordPerPage: 'integer',
      pageNumber: 'integer',
      orderBy: 'string',
      orderDir: 'in:asc,desc',
      registration_no: 'integer',
      caregiver_type: [rule('in', ['1', '2', '3', '4', '5'])],
      mobile_number: 'integer',
      email: 'email|max:255',
      requiredCSV: 'boolean',
      expiredWithinMonth: 'boolean',
      isRefferalFeeDue: 'boolean',
    };
  }

  get messages() {
    return {
      'recordPerPage.integer': 'Record per page must be in integer.',
      'pageNumber.integer': 'Page number must be in integer.',
      'orderBy.string': 'Order by must be a string value.',
      'orderDir.in': 'Order direction must be either asc or desc.',
      'registration_no.integer': 'Registration number must be a number.',
      'caregiver_type.in': 'Caregiver must be in 1 to 5.',
      'mobile_number.integer': 'Mobile number should be in number.',
      'email.email': 'Please enter a valid email address.',
      'requiredCSV.boolean': 'Required CSV must be a boolean value.',
      'expiredWithinMonth.boolean':
        'Expired within month must be a boolean value.',
      'isRefferalFeeDue.boolean': 'Referral Fee Due must be a boolean value.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = GetAllCaregivers;
