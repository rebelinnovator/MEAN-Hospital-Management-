'use strict';

const util = make('App/Services/Common/UtilService');

class CheckSlug {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return { slug: 'trim|escape' };
  }

  get rules() {
    return { slug: 'required' };
  }

  get messages() {
    return { 'slug.required': 'Slug is required' };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = CheckSlug;
