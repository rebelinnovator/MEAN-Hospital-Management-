'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ServiceUserLanguages extends Model {
  // belongs to client
  client() {
    return this.belongsTo('App/Models/Client');
  }
}

module.exports = ServiceUserLanguages;
