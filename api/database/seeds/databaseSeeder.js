'use strict';

const SkillSetsSeeder = require('./skillsetsSeeder');
const LocationsSeeder = require('./locationsSeeder');
const IllnessesSeeder = require('./illnessesSeeder');
const SelfCareAbilitySeeder = require('./selfCareAbilitySeeder');
const SystemSettingSeeder = require('./SystemSettingSeeder');
const AdminSeeder = require('./adminSeeder');

class DatabaseSeeder {
  async run() {
    // Put yours seeders in the desired order
    await LocationsSeeder.run();
    await SkillSetsSeeder.run();
    await IllnessesSeeder.run();
    await SelfCareAbilitySeeder.run();
    await SystemSettingSeeder.run();
    await AdminSeeder.run();
  }
}

module.exports = DatabaseSeeder;
