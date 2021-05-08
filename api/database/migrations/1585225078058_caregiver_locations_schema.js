'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverLocationsSchema extends Schema {
  up() {
    this.create('caregiver_locations', table => {
      table.increments();
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers')
        .notNullable();
      table
        .integer('location_id')
        .unsigned()
        .references('id')
        .inTable('locations')
        .notNullable();
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('caregiver_locations');
  }
}

module.exports = CaregiverLocationsSchema;
