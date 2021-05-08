const HttpStatusCode = require('http-status-codes');

const messages = {
  CAREGIVER_NOT_FOUND: {
    status: HttpStatusCode.NOT_FOUND,
    message: 'Caregiver not found',
  },

  PERSONAL_INFO_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Personal info added successfully',
  },

  EXPERIENCE_EDUCATION_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Work experience and education added successfully',
  },

  SKILLSETS_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Skillset added successfully',
  },

  AVAILABILITY_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Availability added successfully',
  },

  CONFLICT_IN_AVAILABILITY: {
    status: HttpStatusCode.CONFLICT,
    message: 'Conflict in availability hours',
  },

  CHARGES_ADDED: {
    status: HttpStatusCode.OK,
    message: 'Charges added successfully',
  },

  REFERRAL_EMAIL_NOT_EXISTS: {
    status: HttpStatusCode.BAD_REQUEST,
    message: HttpStatusCode.getStatusText(HttpStatusCode.BAD_REQUEST),
    data: [
      {
        message: 'Email address does not exists in our system.',
        field: 'refferers_email',
      },
    ],
  },
};

module.exports = messages;
