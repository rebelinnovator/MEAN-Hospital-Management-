'use strict';

const HttpStatusCode = require('http-status-codes');

const messages = {
  EMAIL_NOT_SEND: {
    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong with sending email',
  },

  NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND,
    message: HttpStatusCode.getStatusText(HttpStatusCode.NOT_FOUND),
  },

  SOMETHING_WENT_WRONG: {
    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: HttpStatusCode.getStatusText(HttpStatusCode.INTERNAL_SERVER_ERROR),
  },

  NOT_IMPLEMENTED: {
    status: HttpStatusCode.NOT_IMPLEMENTED,
    message: HttpStatusCode.getStatusText(HttpStatusCode.NOT_IMPLEMENTED),
  },

  CREATED: {
    status: HttpStatusCode.CREATED,
    message: HttpStatusCode.getStatusText(HttpStatusCode.CREATED),
  },

  SUCCESS: {
    status: HttpStatusCode.OK,
    message: HttpStatusCode.getStatusText(HttpStatusCode.OK),
  },

  ER_DUP_ENTRY: {
    status: HttpStatusCode.CONFLICT,
    message: HttpStatusCode.getStatusText(HttpStatusCode.CONFLICT),
  },
};

module.exports = messages;
