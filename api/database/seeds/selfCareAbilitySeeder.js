'use strict';

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database');
const Logger = use('Logger');

class SelfCareAbilitySeeder {
  /*
    |  You need to add the "static" modifier
    |  so you don't need to instantiate the class
    |  inside the "DatabaseSeeder", making the code
    |  easier to read and write.
    */
  static async run() {
    try {
      const selfCareAbilities = [
        {
          name: 'Toileting',
          children: [{ name: 'No help needed' }, { name: 'Need help' }],
        },
        {
          name: 'Toileting Equipment',
          children: [
            { name: 'Use commode chair' },
            { name: 'Use potty' },
            { name: 'Need to change diapers' },
            { name: 'Need to change foley catheter' },
          ],
        },
        {
          name: 'Shower',
          children: [
            { name: 'No help needed' },
            { name: 'Need help' },
            { name: 'Use bath chair' },
          ],
        },
      ];
      if (selfCareAbilities.length) {
        for (const key in selfCareAbilities) {
          const subCare = selfCareAbilities[key];
          const { 0: abc } = await Database.table('selfcare_abilities').insert({
            name: subCare.name,
          });
          subCare.children = subCare.children.map(el => {
            el.parent_id = abc;
            return el;
          });
          await Database.table('selfcare_abilities').insert(subCare.children);
        }
      }
    } catch (error) {
      Logger.info('locations Seeder Catch %s', error);
    }
  }
}
module.exports = SelfCareAbilitySeeder;
