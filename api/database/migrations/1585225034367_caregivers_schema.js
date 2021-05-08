'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CaregiversSchema extends Schema {
  up() {
    this.create('caregivers', table => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .notNullable();
      table
        .integer('registration_no')
        .notNullable()
        .unique();
      table.string('chinese_name');
      table.string('english_name');
      table.string('nick_name');
      table.string('hkid_card_no');
      table.string('hkid_name');
      table.datetime('tnc_accepted_date');
      table
        .enu('status', ['1', '2', '3'])
        .comment('1=pending,2=approved,3=unapproved')
        .defaultTo('1');
      table
        .enu('caregiver_type', ['1', '2', '3', '4', '5'])
        .comment(
          '1=Registered_nurse,2=Enrolled_nurse,3=health_worker,4=personal_care_worker,5=outpatient_escort_person',
        );
      table.string('refferers_email');
      table.text('self_introduction');
      table.date('licence_expiry_date');
      table.enu('show_employer_option', ['0', '1']).comment('0=No,1=Yes');
      table.enu('is_interviewed', ['0', '1']).comment('0=No,1=Yes');
      table.boolean('payment_method_online');
      table.boolean('payment_method_cheque');
      table.string('fps_mobile_number');
      table.string('bank_name');
      table.string('bank_code');
      table.string('branch_code');
      table.string('account_no');
      table.string('account_name');
      table
        .enu('current_step', ['1', '2', '3', '4', '5', '6', '7'])
        .comment(
          `1=Personal Information, 
          2=Work Experience And Education, 
          3=Skillset,4=Availability, 
          5=Charges,
          6=Email Document,
          7=Terms And Conditions`,
        )
        .defaultTo('1');
      table
        .integer('prev_exp')
        .notNullable()
        .defaultTo(0);
      table.float('avg_rating');
      table.integer('total_completion_event');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('caregivers');
  }
}

module.exports = CaregiversSchema;
