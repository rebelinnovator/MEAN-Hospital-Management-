'use strict';

const Model = use('Model');

class ServiceUserMedicalHistory extends Model {
  static boot() {
    super.boot();
  }

  static get hidden() {
    return ['illness_id', 'client_id'];
  }

  // belongs to illness
  illness() {
    return this.belongsTo('App/Models/Illness').pivotModel(
      'App/Models/ServiceUserMedicalHistory',
    );
  }
}

module.exports = ServiceUserMedicalHistory;
