'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverBookingServicesSchema extends Schema {
  up() {
    this.create('caregiver_booking_services', table => {
      table.increments();
      table
        .integer('caregiver_booking_id')
        .unsigned()
        .references('id')
        .inTable('caregiver_bookings');
      table
        .integer('skillset_id')
        .unsigned()
        .references('id')
        .inTable('skillsets');
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('caregiver_booking_services');
  }
}

module.exports = CaregiverBookingServicesSchema;
