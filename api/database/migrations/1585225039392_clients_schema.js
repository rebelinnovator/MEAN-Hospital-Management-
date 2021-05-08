'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ClientsSchema extends Schema {
  up() {
    this.create('clients', table => {
      table.increments();
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users');
      table.string('first_name');
      table.string('last_name');
      table
        .string('slug')
        .notNullable()
        .unique();
      table.string('home_telephone_number');
      table
        .enu('relation_with_service_user', ['1', '2', '3', '4', '5'])
        .comment(
          '1= I am the Care Receiver,2=father,3=mother,4=relative,5=friend',
        );
      table.enu('service_user_salute', ['1', '2']).comment('1=Mr,2=Mrs');
      table.string('service_user_firstname');
      table.string('service_user_lastname');
      table.date('service_user_dob');
      table.string('servive_user_home_telephone');
      table.string('service_user_mobile');
      table.string('service_user_flat_no');
      table.string('service_user_floor_no');
      table.string('service_user_building_name');
      table.string('service_user_street_name_number');
      table.string('service_user_district');
      table.float('service_user_weight');
      table.float('service_user_height');
      table
        .enu('service_user_diet', ['1', '2', '3'])
        .comment('1=normal,2=minced,3=pureed');
      table.enu('service_user_physical_ability', [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
      table
        .enu('service_user_eye_sight', ['1', '2', '3'])
        .comment('1=normal,2=partially,3=complete');
      table
        .enu('service_user_hearing', ['1', '2', '3'])
        .comment('1=normal,2=partially,3=complete');
      table
        .enu('service_user_lifting', ['1', '2', '3', '4'])
        .comment(
          '1=No Lifting Required,2=One Person Lifting Required,3=Two People Lifting Required,4=Lifting Devices Needed',
        );
      table.string('service_user_lifting_specific');
      table.enu('service_user_lower_left_leg_limb_mobility', [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
      table.enu('service_user_lower_right_leg_limb_mobility', [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
      table.enu('service_user_left_hand_mobility', [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
      table.enu('service_user_right_hand_mobility', [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
      table
        .enu('service_user_assisting_device', ['1', '2', '3', '4', '5'])
        .comment('1=crouches,2=quadripods,3=walker,4=wheel_chair,5=bed_bound');
      table
        .enu('current_step', ['1', '2', '3', '4', '5'])
        .comment(
          `1=Account User Information, 2=Service User Information, 
            3=Service User Background, 4=Service User Medical History,
            5=Terms And Conditions`,
        )
        .defaultTo('1');
      table.text('service_user_other_medical_history');
      table.string('hkid_name');
      table.datetime('tnc_accepted_date');
      table.timestamps(false, true);
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
    });
  }

  down() {
    this.drop('clients');
  }
}

module.exports = ClientsSchema;
