'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiverChargesSchema extends Schema {
  up() {
    this.create('caregiver_charges', table => {
      table.increments();
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers')
        .notNullable();
      table.integer('hour').notNullable();
      table.float('price').notNullable();
      table.timestamps(false, true);
      table.unique(['caregiver_id', 'hour']);
    });
  }

  down() {
    this.drop('caregiver_charges');
  }
}

module.exports = CaregiverChargesSchema;
