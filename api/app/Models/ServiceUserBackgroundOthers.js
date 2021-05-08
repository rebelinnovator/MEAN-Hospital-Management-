'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ServiceUserBackgroundOthers extends Model {
  // belongs to client
  client() {
    return this.belongsTo('App/Models/Client');
  }
}

module.exports = ServiceUserBackgroundOthers;
