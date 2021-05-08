'use strict';

const Model = use('Model');

class Location extends Model {
  static boot() {
    super.boot();
  }

  // parent has many sub locations
  subLocations() {
    return this.hasMany('App/Models/Location', 'id', 'parent_id');
  }
}

module.exports = Location;
