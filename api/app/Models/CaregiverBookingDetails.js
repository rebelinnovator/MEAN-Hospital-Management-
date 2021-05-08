'use strict';

const Model = use('Model');

class CaregiverBookingDetails extends Model {
  static boot() {
    super.boot();
  }

  caregiver() {
    return this.belongsTo('App/Models/Caregiver');
  }
}

module.exports = CaregiverBookingDetails;
