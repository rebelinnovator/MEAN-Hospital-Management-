'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Caregiver extends Model {
  static boot() {
    super.boot();
  }

  // caregiver has many skills
  skills() {
    return this.belongsToMany('App/Models/Skillset').pivotModel(
      'App/Models/CaregiverSkills',
    );
  }

  // caregiver has many locations
  locations() {
    return this.belongsToMany('App/Models/Location').pivotModel(
      'App/Models/CaregiverLocations',
    );
  }

  // caregiver has many languages
  languages() {
    return this.hasMany('App/Models/CaregiverLanguages', 'id', 'caregiver_id');
  }

  // caregiver has many availabilities
  availability() {
    return this.hasMany(
      'App/Models/CaregiverAvailability',
      'id',
      'caregiver_id',
    );
  }

  // caregiver belongs to a user
  user() {
    return this.belongsTo('App/Models/User');
  }

  // caregiver has many experiences
  employer() {
    return this.hasMany('App/Models/CaregiverEmployer');
  }

  // caregiver has many qualifications
  education() {
    return this.hasMany('App/Models/CaregiverEducation');
  }

  // caregiver has many charges
  charges() {
    return this.hasMany('App/Models/CaregiverCharges', 'id', 'caregiver_id');
  }

  // caregiver has many bookings
  bookings() {
    return this.belongsToMany('App/Models/CaregiverBooking').pivotModel(
      'App/Models/CaregiverBookingDetails',
    );
  }

  // caregiver has many feedbacks
  feedbacks() {
    return this.hasMany('App/Models/ClientFeedbacks', 'id', 'caregiver_id');
  }

  // caregiver has many referrals (at max 3)
  referrals() {
    return this.hasMany('App/Models/UserRefferal', 'id', 'caregiver_id');
  }

  caregiverDetail() {
    return this.hasMany('App/Models/CaregiverBookingDetails');
  }
}

module.exports = Caregiver;
