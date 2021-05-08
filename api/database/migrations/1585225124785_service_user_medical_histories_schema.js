'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ServiceUserMedicalHistorySchema extends Schema {
  up() {
    this.create('service_user_medical_histories', table => {
      table.increments();
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .notNullable();
      table
        .integer('illness_id')
        .unsigned()
        .references('id')
        .inTable('illnesses')
        .notNullable();
      table.string('specific_title');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('service_user_medical_histories');
  }
}

module.exports = ServiceUserMedicalHistorySchema;
