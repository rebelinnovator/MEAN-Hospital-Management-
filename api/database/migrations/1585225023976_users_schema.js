'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments();
      table.date('dob');
      table.string('email').notNullable();
      table.string('email_temp');
      table.string('password').notNullable();
      table.string('mobile_number');
      table.enu('salute', ['1', '2']).comment('1=Mr,2=Mrs');
      table
        .enu('preferred_communication_language', ['1', '2'])
        .comment('1=chinese,2=English');
      table
        .enu('user_type', ['1', '2', '3'])
        .comment('1=admin,2=caregiver,3=client')
        .notNullable();
      table
        .enu('status', ['0', '1'])
        .comment('0=Inactive,1=Active')
        .notNullable()
        .defaultTo('0');
      table
        .string('slug')
        .notNullable()
        .unique();
      table.string('email_verification_token');
      table.float('due_amount');
      table.float('total_service_fee');
      table.boolean('is_deleted').defaultTo(false);
      table.datetime('deleted_at');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
