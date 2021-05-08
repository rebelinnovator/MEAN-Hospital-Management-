'use strict';

const util = make('App/Services/Common/UtilService');

class AddUpdateCharges {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      registration_no: 'to_int',
      fps_mobile_number: 'escape',
      bank_name: 'escape',
      bank_code: 'escape',
      account_no: 'escape',
      account_name: 'escape',
    };
  }

  get rules() {
    return {
      'registration_no': 'required',
      'payment_method_online': 'required|boolean',
      'payment_method_cheque': 'required|boolean',
      'charges': 'required|array',
      'charges.*.hour': 'required|integer',
      'charges.*.price': 'required|number',
      'deleted_charges': 'array',
      'deleted_charges.*': 'number',
      'fps_mobile_number': 'required_when:payment_method_online,1',
      'bank_name': 'required_when:payment_method_online,1',
      'bank_code': 'required_when:payment_method_online,1',
      'branch_code': 'required_when:payment_method_online,1',
      'account_no': 'required_when:payment_method_online,1',
      'account_name': 'required_when:payment_method_online,1',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'payment_method_online.required': 'Online payment method is required.',
      'payment_method_online.boolean':
        'Online payment method must be a boolean value.',
      'payment_method_cheque.required': 'Cheque payment method is required.',
      'payment_method_cheque.boolean':
        'Cheque payment method must be a boolean value.',
      'charges.required': 'Charges are required.',
      'charges.array': 'Charges must be an array.',
      'charges.*.hour.required': 'Hour is required.',
      'charges.*.hour.integer': 'Hour must be an integer value.',
      'charges.*.price.required': 'Price is required.',
      'charges.*.price.number': 'Price must be a number / float.',
      'deleted_charges.array': 'Deleted charges must be an array.',
      'deleted_charges.*.number':
        'All values for deleted charges must be number.',
      'fps_mobile_number.required_when': 'FPS mobile number is required.',
      'bank_name.required_when': 'Bank name is required.',
      'bank_code.required_when': 'Bank code is required.',
      'branch_code.required_when': 'Branch code is required.',
      'account_no.required_when': 'Account no is required.',
      'account_name.required_when': 'Account name is required.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateCharges;
