'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class AddUpdateAvailability {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { registration_no: 'to_int' };
  }

  get rules() {
    return {
      'registration_no': 'required',
      'availability.*.from_day': [
        rule('required'),
        rule('in', ['0', '1', '2', '3', '4', '5', '6']),
      ],
      'availability.*.to_day': [
        rule('required'),
        rule('in', ['0', '1', '2', '3', '4', '5', '6']),
      ],
      'availability.*.from_time': [
        rule('required'),
        rule('regex', /([0-1][0-9]|2[0-3]):[0-5][0-9]/),
      ],
      'availability.*.to_time': [
        rule('required'),
        rule('regex', /([0-1][0-9]|2[0-3]):[0-5][0-9]/),
      ],
      'locations': 'array',
      'locations.*': 'number',
      'deleted_availability': 'array',
      'deleted_availability.*': 'number',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'availability.*.from_day.required': 'Day from is required.',
      'availability.*.from_day.in': 'Day from must be in 0 to 6.',
      'availability.*.to_day.required': 'Day to is required.',
      'availability.*.to_day.in': 'Day to must be in 0 to 6.',
      'availability.*.from_time.required': 'Time from is required.',
      'availability.*.from_time.regex': 'Invalid value for time from.',
      'availability.*.to_time.required': 'Time to is required.',
      'availability.*.to_time.regex': 'Invalid value for time to.',
      'locations.array': 'Locations should be an array.',
      'locations.*.number': 'All values for locations must be number.',
      'deleted_availability.array':
        'Deleted availabilities should be an array.',
      'deleted_availability.*.number':
        'All values for deleted availabilities must be number.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateAvailability;
