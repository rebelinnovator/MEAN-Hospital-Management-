'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserRefferalsSchema extends Schema {
  up() {
    this.create('user_refferals', table => {
      table.increments();
      table
        .integer('caregiver_booking_id')
        .unsigned()
        .references('id')
        .inTable('caregiver_bookings');
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable();
      table.float('amount').notNullable();
      table.datetime('paid_at');
      table
        .enu('type', ['1', '2'])
        .comment('1=Earned,2=Paid')
        .notNullable();
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('user_refferals');
  }
}

module.exports = UserRefferalsSchema;
