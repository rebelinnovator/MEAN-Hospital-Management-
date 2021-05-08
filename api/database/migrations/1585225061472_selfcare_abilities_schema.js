'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SelfcareAbilitiesSchema extends Schema {
  up() {
    this.create('selfcare_abilities', table => {
      table.increments();
      table.string('name').notNullable();
      table
        .integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('selfcare_abilities');
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('selfcare_abilities');
  }
}

module.exports = SelfcareAbilitiesSchema;
