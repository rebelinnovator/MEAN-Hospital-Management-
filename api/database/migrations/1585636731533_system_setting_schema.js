'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class SystemSettingSchema extends Schema {
  up() {
    this.create('system_settings', table => {
      table.increments();
      table.string('title').unique();
      table.string('value');
      table.timestamps(false, true);
    });
  }

  down() {
    this.drop('system_settings');
  }
}

module.exports = SystemSettingSchema;
