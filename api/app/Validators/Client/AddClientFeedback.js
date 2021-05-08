'use strict';

const util = make('App/Services/Common/UtilService');

class AddClientFeedback {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      slug: 'escape',
      booking_id: 'escape',
      positive_feedback: 'escape',
      negative_feedback: 'escape',
    };
  }

  get rules() {
    return {
      slug: 'required|string',
      booking_id: 'required|string',
      rating: 'required|number',
      positive_feedback: 'string',
      negative_feedback: 'string',
    };
  }

  get messages() {
    return {
      'slug.required': 'slug is required.',
      'slug.string': 'slug must be string',
      'booking_id.required': 'booking_id is required',
      'booking_id.string': 'booking_id must be string',
      'rating.number': 'rating must be number.',
      'positive_feedback.string': 'positive_feedback should be in string.',
      'negative_feedback.string': 'negative_feedback should be in string.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddClientFeedback;
