'use strict';

const Env = use('Env');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | Connection to be used for sending emails. Each connection needs to
  | define a driver too.
  |
  */
  connection: Env.get('MAIL_CONNECTION', 'smtp'),

  /*
  |--------------------------------------------------------------------------
  | SMTP
  |--------------------------------------------------------------------------
  |
  | Here we define configuration for sending emails via SMTP.
  |
  */
  smtp: {
    driver: 'smtp',
    pool: true,
    port: Env.get('SMTP_PORT'),
    host: Env.get('SMTP_HOST'),
    secure: true,
    auth: {
      user: Env.get('MAIL_USER'),
      // pass: 'S0$pbbn#v',
      pass: Env.get('MAIL_PASS'),
      from: Env.get('EMAIL_FROM'),
    },

    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10,
  },
};
