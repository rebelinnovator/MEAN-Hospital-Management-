'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class IllnessSchema extends Schema {
  up() {
    this.create('illnesses', table => {
      table.increments();
      table
        .integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('illnesses');
      table.string('english_title');
      table.boolean('is_specific').defaultTo(false);
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('illnesses');
  }
}

module.exports = IllnessSchema;
