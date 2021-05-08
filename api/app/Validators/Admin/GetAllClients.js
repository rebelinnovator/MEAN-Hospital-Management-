'use strict';

const util = make('App/Services/Common/UtilService');

class GetAllClients {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      recordPerPage: 'to_int',
      pageNumber: 'to_int',
      orderBy: 'escape',
    };
  }

  get rules() {
    return {
      recordPerPage: 'integer',
      pageNumber: 'integer',
      orderBy: 'string',
      orderDir: 'in:asc,desc',
      mobile_number: 'integer',
      email: 'email|max:255',
      isRefferalFeeDue: 'in:true,false',
    };
  }

  get messages() {
    return {
      'recordPerPage.integer': 'Record per page must be in integer.',
      'pageNumber.integer': 'Page number must be in integer.',
      'orderBy.string': 'Order by must be a string value.',
      'orderDir.in': 'Order direction must be either asc or desc.',
      'mobile_number.integer': 'Mobile number should be in number.',
      'email.email': 'Please enter a valid email address.',
      'isRefferalFeeDue.in': 'Refferal fee due must be either true or false.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = GetAllClients;
