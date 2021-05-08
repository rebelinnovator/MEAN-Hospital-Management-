'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ServiceUserLanguagesSchema extends Schema {
  up() {
    this.create('service_user_languages', table => {
      table.increments();
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients');
      table
        .enu('language', ['1', '2', '3', '4'])
        .comment('1=cantonese,2=mandarin,3=english,4=dialect');
      table.string('other_lang');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('service_user_languages');
  }
}

module.exports = ServiceUserLanguagesSchema;
