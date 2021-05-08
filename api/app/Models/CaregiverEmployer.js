'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class CaregiverEmployer extends Model {
  caregiver() {
    return this.belongsToMany('App/Models/Caregiver');
  }
}

module.exports = CaregiverEmployer;
