'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverAvailabilitySchema extends Schema {
  up() {
    this.create('caregiver_availabilities', table => {
      table.increments();
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers')
        .notNullable();
      table
        .enu('from_day', ['0', '1', '2', '3', '4', '5', '6'])
        .comment('0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat')
        .notNullable();
      table
        .enu('to_day', ['0', '1', '2', '3', '4', '5', '6'])
        .comment('0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat')
        .notNullable();
      table.string('from_time', 5).notNullable();
      table.string('to_time', 5).notNullable();
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('caregiver_availabilities');
  }
}

module.exports = CaregiverAvailabilitySchema;
