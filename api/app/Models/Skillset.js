'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Skillset extends Model {
  static boot() {
    super.boot();
  }

  skillset() {
    return this.hasMany('App/Models/Skillset', 'id', 'Skillset_id');
  }
}
module.exports = Skillset;
