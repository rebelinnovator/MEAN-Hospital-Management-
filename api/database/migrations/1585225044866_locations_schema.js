'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class LocationsSchema extends Schema {
  up() {
    this.create('locations', table => {
      table.increments();
      table.string('name').notNullable();
      table
        .integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('locations');
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('locations');
  }
}

module.exports = LocationsSchema;
