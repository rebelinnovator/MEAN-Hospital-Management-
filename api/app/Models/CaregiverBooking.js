'use strict';

const Model = use('Model');

class CaregiverBooking extends Model {
  static boot() {
    super.boot();
  }

  // booking has many services
  services() {
    return this.belongsToMany('App/Models/Skillset').pivotModel(
      'App/Models/CaregiverBookingServices',
    );
  }

  // booking has many caregiver
  caregiverDetail() {
    return this.hasMany('App/Models/CaregiverBookingDetails');
  }

  // belongs to client
  client() {
    return this.belongsTo('App/Models/Client');
  }
}

module.exports = CaregiverBooking;
