'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PasswordResetSchema extends Schema {
  up() {
    this.create('password_resets', table => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users');
      table
        .string('token', 255)
        .notNullable()
        .unique()
        .index();
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('password_resets');
  }
}

module.exports = PasswordResetSchema;
