'use strict';

const Model = use('Model');

class ServiceUserSelfcareAbility extends Model {
  static boot() {
    super.boot();
  }

  static get hidden() {
    return ['selfcare_ability_id', 'client_id'];
  }

  // belongs to client
  client() {
    return this.belongsTo('App/Models/Client');
  }

  // belongs to illness
  selfCareAbility() {
    return this.belongsTo('App/Models/SelfCareAbility').pivotModel(
      'App/Models/ServiceUserSelfcareAbility',
    );
  }
}

module.exports = ServiceUserSelfcareAbility;
