'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverEducationsSchema extends Schema {
  up() {
    this.create('caregiver_educations', table => {
      table.increments();
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers');
      table.string('institute_name');
      table.string('degree');
      table.integer('start_year');
      table.integer('end_year');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('caregiver_educations');
  }
}

module.exports = CaregiverEducationsSchema;
