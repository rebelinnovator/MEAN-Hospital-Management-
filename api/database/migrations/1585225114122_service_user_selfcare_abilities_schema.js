'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ServiceUserSelfcareAbilitiesSchema extends Schema {
  up() {
    this.create('service_user_selfcare_abilities', table => {
      table.increments();
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients')
        .notNullable();
      table
        .integer('selfcare_ability_id')
        .unsigned()
        .references('id')
        .inTable('selfcare_abilities')
        .notNullable();
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('service_user_selfcare_abilities');
  }
}

module.exports = ServiceUserSelfcareAbilitiesSchema;
