'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverLanguagesSchema extends Schema {
  up() {
    this.create('caregiver_languages', table => {
      table.increments();
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers')
        .notNullable();
      table
        .enu('language', ['1', '2', '3', '4'])
        .comment('1=cantonese,2=mandarin,3=english,4=dialect')
        .notNullable();
      table.string('other_lang');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('caregiver_languages');
  }
}

module.exports = CaregiverLanguagesSchema;
