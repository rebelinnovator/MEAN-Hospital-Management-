'use strict';

const Model = use('Model');

class CaregiverLocations extends Model {
  static boot() {
    super.boot();
  }

  // belongs to one location
  location() {
    return this.belongsTo('App/Models/Location').pivotModel(
      'App/Models/CaregiverLocations',
    );
  }
}

module.exports = CaregiverLocations;
