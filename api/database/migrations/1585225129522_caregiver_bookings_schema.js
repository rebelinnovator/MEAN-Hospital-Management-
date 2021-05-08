'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverBookingsSchema extends Schema {
  up() {
    this.create('caregiver_bookings', table => {
      table.increments();
      table
        .string('booking_id')
        .notNullable()
        .unique();
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients');
      table.datetime('date');
      table.datetime('start_time');
      table.datetime('end_time');
      table.integer('duration');
      table.float('transport_subsidy');
      table
        .enu('cancelled_by', ['1', '2', '3'])
        .comment('1=admin,2=caregiver,3=client');
      table
        .enu('status', ['1', '2', '3', '4'])
        .comment('1=awaiting_for_response,2=confirmed,3=rejected,4=cancelled')
        .defaultTo('1');
      table
        .enu('payment_status', ['1', '2', '3', '4'])
        .comment('1=unpaid,2=paid,3=cancelled,4=refund')
        .defaultTo('1');
      table
        .enu('payment_status_caregiver', ['1', '2', '3', '4'])
        .comment('1=unpaid,2=paid,3=cancelled,4=refund')
        .defaultTo('1');
      table.datetime('payment_date_caregiver');
      table.datetime('payment_date_client');
      table.string('receipt_number');
      table.integer('completion_count').defaultTo(0);
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('caregiver_bookings');
  }
}

module.exports = CaregiverBookingsSchema;
