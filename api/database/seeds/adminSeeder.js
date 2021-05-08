'use strict';

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database');
const Logger = use('Logger');

class AdminSeeder {
  static async run() {
    try {
      const users = [
        {
          email: 'info@purecare.com.hk',
          password:
            '$2a$10$cdiKRUn2ujq5HZUJq2ekyeT.PfJizL6yPfALUUoByzygpjmAaoJ6e',
          slug: 'info-purecare-com-hk',
          user_type: '1',
          status: '1',
        },
      ];
      if (users.length) {
        await Database.table('users').insert(users);
      }
    } catch (error) {
      Logger.info('users Seeder Catch %s', error);
    }
  }
}

module.exports = AdminSeeder;
