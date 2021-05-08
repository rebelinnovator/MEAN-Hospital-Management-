const HttpStatusCode = require('http-status-codes');

const messages = {
  CLIENT_NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND,
    message: 'Client not found',
  },

  CLIENT_FEEDBACK_NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND,
    message: 'Clientfeedback not found',
  },

  ACCOUNT_USER_INFO_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Account user info added successfully',
  },

  SERVICE_USER_INFO_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Care receiver info added successfully',
  },

  SERVICE_USER_BACKGROUND_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Care receiver background added successfully',
  },

  SERVICE_USER_MEDICAL_HISTORY_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Care receiver medical history added successfully',
  },

  PROFILE_NOT_COMPLETED: {
    status: HttpStatusCode.CONFLICT,
    message: 'Please complete your profile before booking appointment',
  },

  MAX_BOOKING_REACHED: {
    status: HttpStatusCode.CONFLICT,
    message: 'Maximum open appointment limit has been reached',
  },

  FEEDBACK_SUBMITTED: {
    status: HttpStatusCode.OK,
    message: 'Thank you for your valuable feedback',
  },

  FEEDBACK_ALREADY_SUBMITTED: {
    status: HttpStatusCode.CONFLICT,
    message: 'You have already submited feedback for this booking service',
  },
};

module.exports = messages;
