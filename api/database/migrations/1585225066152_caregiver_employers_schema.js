'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverEmployersSchema extends Schema {
  up() {
    this.create('caregiver_employers', table => {
      table.increments();
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers');
      table.string('name');
      table.enu('work_type', ['1', '2']).comment('1=full_time,2=part_time');
      table.integer('from_month');
      table.integer('from_year');
      table.integer('to_month');
      table.integer('to_year');
      table.enu('is_current_employer', ['0', '1']).comment('0=No,1=Yes');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('caregiver_employers');
  }
}

module.exports = CaregiverEmployersSchema;
