'use strict';

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Database = use('Database');
const Logger = use('Logger');

class SystemSettingSeeder {
  static async run() {
    try {
      const settings = [
        {
          title: 'caregiver_service_fee',
          value: '0',
        },
        {
          title: 'client_service_fee',
          value: '0',
        },
        {
          title: 'caregiver_referral',
          value: '100',
        },
        {
          title: 'sort_by_exp',
          value: 'asc',
        },
        {
          title: 'sort_by_rating',
          value: 'asc',
        },
      ];
      if (settings.length) {
        await Database.table('system_settings').insert(settings);
      }
    } catch (error) {
      Logger.info('system_settings Seeder Catch %s', error);
    }
  }
}

module.exports = SystemSettingSeeder;
