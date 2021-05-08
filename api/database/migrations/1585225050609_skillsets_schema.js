'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SkillsetsSchema extends Schema {
  up() {
    this.create('skillsets', table => {
      table.increments();
      table
        .enu('caregiver_type', ['1', '2', '3', '4', '5'])
        .comment(
          '1=registered_nurse,2=enrolled_nurse,3=health_worker,4=personal_care_worker,5=out_patient_escort_person',
        );
      table.enu('type', ['1', '2']).comment('1=personal,2=special');
      table.string('english_title');
      table.text('en_explanation');
      table.text('ch_explanation');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('skillsets');
  }
}

module.exports = SkillsetsSchema;
