const HttpStatusCode = require('http-status-codes');

const messages = {
  REGISTERED: {
    status: HttpStatusCode.OK,
    message:
      'We have sent a link to your email address. Please don’t forget to check your junk mail folder.',
  },

  EMAIL_ALREADY_REGISTERED: {
    status: HttpStatusCode.CONFLICT,
    message: 'Email address is already registered in the system.',
  },

  CAREGIVER_REGISTERED: {
    status: HttpStatusCode.OK,
    message: 'Caregiver registered successfully.',
  },

  CLIENT_REGISTERED: {
    status: HttpStatusCode.OK,
    message: 'Client registered successfully.',
  },

  CONFIRM_EMAIL: {
    status: HttpStatusCode.OK,
    message: 'Your Email has been confirmed',
  },

  INVALID_CONFIRM_LINK: {
    status: HttpStatusCode.OK,
    message: 'Invalid confirmation link',
  },

  CONFIRMED_EMAIL: {
    status: HttpStatusCode.CONFLICT,
    message: 'Email is already confirmed',
  },

  CHANGE_PASSWORD: {
    status: HttpStatusCode.OK,
    message: 'Your Password Updated Successfully',
  },

  PASSWORD_RESET: {
    status: HttpStatusCode.OK,
    message:
      'Password reset link is sent to your email address if this is registered with us. Please don’t forget to check your junk mail folder.',
  },

  LOGIN: {
    status: HttpStatusCode.OK,
    message: 'Login successful.',
  },

  USER_NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND,
    message: 'User not found',
  },

  EMAIL_NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND,
    message: 'Email ID is not registered with us.',
  },

  INACTIVE_USER: {
    status: HttpStatusCode.CONFLICT,
    message: 'Please activate your account',
  },

  INCORRECT_PASSWORD: {
    status: HttpStatusCode.CONFLICT,
    message: 'Password is incorrect',
  },

  INVALID_TOKEN: {
    status: HttpStatusCode.UNAUTHORIZED,
    message: 'Session expired',
  },

  INVALID_RESET_TOKEN: {
    status: HttpStatusCode.NOT_FOUND,
    message: 'Invalid reset password link',
  },

  FORBIDDEN: {
    status: HttpStatusCode.FORBIDDEN,
    message: 'You are not allowed to use this',
  },

  LESSER_DUE_AMOUNT: {
    status: HttpStatusCode.CONFLICT,
    message: 'You are trying to pay more amount than due amount',
  },

  INVALID_USER_OR_PASSWORD: {
    status: HttpStatusCode.BAD_REQUEST,
    message: HttpStatusCode.getStatusText(HttpStatusCode.BAD_REQUEST),
    data: [
      {
        message:
          'Wrong email address/password. Try again or click Forgot password to reset it.',
        field: 'password',
      },
    ],
  },

  INVALID_USER_OR_PASSWORD_ADMIN: {
    status: HttpStatusCode.BAD_REQUEST,
    message: HttpStatusCode.getStatusText(HttpStatusCode.BAD_REQUEST),
    data: [
      {
        message: 'Wrong email address/password. Try again.',
        field: 'password',
      },
    ],
  },

  DELETED_USER: {
    status: HttpStatusCode.UNAUTHORIZED,
    message: 'User is no longer available in system',
  },

  BROWSER_FINGERPRINT_REQUIRED: {
    status: HttpStatusCode.FORBIDDEN,
    message: 'Device ID Required',
  },
};

module.exports = messages;
