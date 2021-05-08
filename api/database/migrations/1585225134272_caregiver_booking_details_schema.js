'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverBookingDetailsSchema extends Schema {
  up() {
    this.create('caregiver_booking_details', table => {
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
      table.integer('caregiver_charges_hour').notNullable();
      table.float('caregiver_charges_price').notNullable();
      table.float('total_amount').notNullable();
      table.float('caregiver_charges').notNullable();
      table.float('caregiver_service_fee').notNullable();
      table.float('client_service_fee').notNullable();
      table
        .enu('status', ['1', '2', '3'])
        .comment('1=awaiting_for_response,2=accepted,3=rejected')
        .defaultTo('1');
      table.enu('is_cancelled', ['0', '1']).comment('0=No,1=Yes');
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('caregiver_booking_details');
  }
}

module.exports = CaregiverBookingDetailsSchema;
