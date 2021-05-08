'use strict';

const util = make('App/Services/Common/UtilService');

class PayReferralBonus {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {};
  }

  get rules() {
    return {
      user_id: 'required',
      amount: 'required|number',
      date: 'required|dateFormat:YYYY-MM-DD',
    };
  }

  get messages() {
    return {
      'user_id.required': 'User is required.',
      'amount.required': 'Amount is required.',
      'amount.number': 'Amount must be a number.',
      'date.required': 'Date is required.',
      'date.dateFormat': 'Date format should be YYYY-MM-DD.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = PayReferralBonus;
