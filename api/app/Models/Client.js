'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Client extends Model {
  static boot() {
    super.boot();
    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'user_id' },
      strategy: 'dbIncrement',
      disableUpdates: true,
    });
  }

  /* static get dates() {
    return super.dates.concat(['service_user_dob'])
  }

  static formatDates(field, value) {
    if (field === 'service_user_dob') {
      return value.format('YYYY-MM-DD')
    }
    return super.formatDates(field, value)
  } */

  user() {
    return this.belongsTo('App/Models/User');
  }

  // client has many other devices
  otherDevices() {
    return this.hasMany('App/Models/ServiceUserBackgroundOthers');
  }

  // client has many languages
  languages() {
    return this.hasMany('App/Models/ServiceUserLanguages');
  }

  // client has many self care abilities
  selfCareAbilities() {
    return this.belongsToMany('App/Models/SelfcareAbility').pivotModel(
      'App/Models/ServiceUserSelfcareAbility',
    );
  }

  // client has many illness
  illness() {
    return this.belongsToMany('App/Models/Illness').pivotModel(
      'App/Models/ServiceUserMedicalHistory',
    );
  }

  // client has many bookings (for client listing sorting -> Admin)
  bookings() {
    return this.hasMany('App/Models/CaregiverBooking')
      .whereNull('cancelled_by')
      .where('status', '2');
  }

  caregiverBooking() {
    return this.hasMany('App/Models/CaregiverBooking');
  }
}

module.exports = Client;
