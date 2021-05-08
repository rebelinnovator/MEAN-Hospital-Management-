'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class AddBooking {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { slug: 'escape' };
  }

  get rules() {
    return {
      'slug': 'required',
      'date': [rule('required'), rule('dateFormat', 'YYYY-MM-DD')],
      'start_time': [rule('required'), rule('regex', /([0-1][0-9]|2[0-3])/)],
      'end_time': [rule('required'), rule('regex', /([0-1][0-9]|2[0-3])/)],
      'services': 'required|array',
      'services.*': 'number',
      'caregiver': 'required|array|max:3',
      'caregiver.*.caregiver_id': 'required|number',
      'caregiver.*.caregiver_charges': 'required|number',
      'caregiver.*.total_amount': 'required|number',
      'caregiver.*.client_service_fee': 'required|number',
      'duration': 'required|number',
      'transpot_subsidy': 'number',
    };
  }

  get messages() {
    return {
      'slug.required': 'Slug is required',
      'date.required': 'Date is required',
      'date.dateFormat': 'Please enter valid Date e.g. {{argument}}',
      'start_time.required': 'Start Time is required',
      'start_time.regex': 'Please enter valid Start Time.',
      'end_time.required': 'End Time is required',
      'end_time.regex': 'Please enter valid End Time.',
      'services.required': 'Service is required.',
      'services.array': 'Service must be an array.',
      'services.*.number': 'All values for Service must be number.',
      'caregiver.required': 'Caregiver is required.',
      'caregiver.max': 'Maximum {{argument}} Caregivers are allowed.',
      'caregiver.array': 'Caregiver must be an array.',
      'caregiver.*.caregiver_id.required': 'caregiver_id is required.',
      'caregiver.*.caregiver_id.number': 'caregiver_id must be number.',
      'caregiver.*.caregiver_charges.required':
        'caregiver_charges is required.',
      'caregiver.*.caregiver_charges.number':
        'caregiver_chargesmust be number.',
      'caregiver.*.total_amount.required': 'total_amount is required.',
      'caregiver.*.total_amount.number': 'total_amount must be number.',
      'caregiver.*.client_service_fee.required':
        'client_service_fee is required.',
      'caregiver.*.client_service_fee.number':
        'client_service_fee must be number.',
      'duration.required': 'Duration is required.',
      'duration.number': 'Duration must be a number.',
      'transpot_subsidy': 'Transport subsidy must be a number.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddBooking;
