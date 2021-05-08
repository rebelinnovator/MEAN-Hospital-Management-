'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class SearchCaregiver {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      recordPerPage: 'to_int',
      pageNumber: 'to_int',
      registration_no: 'to_int',
    };
  }

  get rules() {
    return {
      'recordPerPage': 'integer',
      'pageNumber': 'integer',
      'orderBy': 'in:price,feedback,experience',
      'durationSort': 'required_when:orderBy,price|in:true,false',
      'orderDir': 'in:asc,desc',
      'registration_no': 'integer',
      'location_id': 'integer',
      'caregiver_type': [rule('in', ['1', '2', '3', '4', '5'])],
      'services': 'array',
      'services.*': 'number',
      'date': [rule('dateFormat', 'YYYY-MM-DD')],
      'from_time': [rule('regex', /([0-1][0-9]|2[0-3]):[0-5][0-9]/)],
      'to_time': [
        rule('required_if', 'from_time'),
        rule('regex', /([0-1][0-9]|2[0-3]):[0-5][0-9]/),
      ],
    };
  }

  get messages() {
    return {
      'recordPerPage.integer': 'Record per page must be in integer.',
      'pageNumber.integer': 'Page number must be in integer.',
      'sorting.array': 'Sorting should be an array.',
      'orderBy.in': 'Order direction should be in {{argument}}.',
      'durationSort.required_when': 'Duration sort is required.',
      'durationSort.in': 'Duration sort should be in {{argument}}.',
      'orderDir.in': 'Order direction must be either asc or desc.',
      'registration_no.integer': 'Registration number must be a number.',
      'location_id.integer': 'Location id must be a number.',
      'caregiver_type.in': 'Caregiver must be in 1 to 5.',
      'services.array': 'Services should be an array.',
      'services.*.number': 'All services must be a number.',
      'date.dateFormat': 'Please enter valid Date e.g. {{argument}}',
      'from_time.regex': 'Invalid value for time from.',
      'to_time.regex': 'Invalid value for time to.',
      'to_time.required_if': 'To time is required.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = SearchCaregiver;
