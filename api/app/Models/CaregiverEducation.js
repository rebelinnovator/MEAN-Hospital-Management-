'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class CaregiverEducation extends Model {
  caregiver() {
    return this.belongsToMany('App/Models/Caregiver');
  }
}
module.exports = CaregiverEducation;
