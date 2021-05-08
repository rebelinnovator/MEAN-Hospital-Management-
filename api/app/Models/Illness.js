'use strict';

const Model = use('Model');

class Illness extends Model {
  static boot() {
    super.boot();
  }

  // parent has many sub illness
  children() {
    return this.hasMany('App/Models/Illness', 'id', 'parent_id');
  }
}

module.exports = Illness;
