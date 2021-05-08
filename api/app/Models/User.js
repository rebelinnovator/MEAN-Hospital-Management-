'use strict';

const Model = use('Model');

class User extends Model {
  static boot() {
    super.boot();

    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'email' },
      strategy: 'dbIncrement',
      disableUpdates: true,
    });
  }

  caregiver() {
    return this.hasOne('App/Models/Caregiver');
  }

  client() {
    return this.hasOne('App/Models/Client');
  }
}

module.exports = User;
