'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ClientFeedbacksSchema extends Schema {
  up() {
    this.create('client_feedbacks', table => {
      table.increments();
      table
        .integer('caregiver_booking_id')
        .unsigned()
        .references('id')
        .inTable('caregiver_bookings');
      table
        .integer('caregiver_id')
        .unsigned()
        .references('id')
        .inTable('caregivers');
      table
        .integer('client_id')
        .unsigned()
        .references('id')
        .inTable('clients');
      table.float('rating');
      table.string('positive_feedback');
      table.string('negative_feedback');
      table.boolean('is_deleted').defaultTo(false);
      table.datetime('deleted_at');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('client_feedbacks');
  }
}

module.exports = ClientFeedbacksSchema;
