'use strict';

const Model = use('Model');

class CaregiverBookingServices extends Model {
  static get hidden() {
    return ['skillset_id', 'caregiver_booking_id'];
  }
}

module.exports = CaregiverBookingServices;
