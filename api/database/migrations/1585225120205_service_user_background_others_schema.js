'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ServiceUserBackgroundOthersSchema extends Schema {
  up() {
    this.create('service_user_background_others', table => {
      table.increments();
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .notNullable();
      table
        .enu('other_device', ['1', '2', '3', '4', '5'])
        .comment(
          '1=> Wear Pacemaker 2=> Hard to swallow 3=> Incontinence 4=> Drug Allergy - Please specify, 5=>Violence',
        )
        .notNullable();
      table.string('specific_drug');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('service_user_background_others');
  }
}

module.exports = ServiceUserBackgroundOthersSchema;
