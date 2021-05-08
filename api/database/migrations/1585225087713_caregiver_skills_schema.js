'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverSkillsSchema extends Schema {
  up() {
    this.create('caregiver_skills', table => {
      table.increments();
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers');
      table
        .integer('skillset_id')
        .unsigned()
        .references('id')
        .inTable('skillsets');
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('caregiver_skills');
  }
}

module.exports = CaregiverSkillsSchema;
