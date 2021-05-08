'use strict';

const util = make('App/Services/Common/UtilService');

class UpdateSysSettings {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      'settings.*.title': 'escape',
      'settings.*.value': 'escape',
    };
  }

  get rules() {
    return {
      'settings': 'required|array',
      'settings.*.title': 'required',
      'settings.*.value': 'required',
    };
  }

  get messages() {
    return {
      'settings.required': 'Settings are required',
      'settings.array': 'Settings should be an array',
      'settings.*.title.required': 'Title is required',
      'settings.*.value.required': 'Value is required',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = UpdateSysSettings;
