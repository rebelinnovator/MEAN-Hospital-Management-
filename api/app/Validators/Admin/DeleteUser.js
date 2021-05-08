'use strict';

const util = make('App/Services/Common/UtilService');

class DeleteUser {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {};
  }

  get rules() {
    return { user: 'array|required' };
  }

  get messages() {
    return { 'user.array': 'user should be an array.' };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = DeleteUser;
