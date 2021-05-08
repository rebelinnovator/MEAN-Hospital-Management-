'use strict';

const Model = use('Model');

class SelfcareAbility extends Model {
  static boot() {
    super.boot();
  }

  // parent has many sub abilities
  subAbilities() {
    return this.hasMany('App/Models/SelfcareAbility', 'id', 'parent_id');
  }

  // sub ability has one parent
  parent() {
    return this.hasOne('App/Models/SelfcareAbility', 'parent_id', 'id');
  }
}

module.exports = SelfcareAbility;
