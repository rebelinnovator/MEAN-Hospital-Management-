'use strict';

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database');
const Logger = use('Logger');

class LocationsSeeder {
  /*
  |  You need to add the "static" modifier
  |  so you don't need to instantiate the class
  |  inside the "DatabaseSeeder", making the code
  |  easier to read and write.
  */
  static async run() {
    try {
      const locations = [
        {
          name: 'Hong Kong Island',
          children: [
            { name: 'Central and Western' },
            { name: 'Eastern' },
            { name: 'Southern' },
            { name: 'Wan Chai' },
          ],
        },
        {
          name: 'Kowloon',
          children: [
            { name: 'Sham Shu Po' },
            { name: 'Kowloon City' },
            { name: 'Kwun Tong' },
            { name: 'Wong Tai Sin' },
            { name: 'Yau Tsim Mong' },
          ],
        },
        {
          name: 'New Territories',
          children: [
            { name: 'Islands' },
            { name: 'Kwai Tsing' },
            { name: 'North' },
            { name: 'Sai Kung' },
            { name: 'Sha Tin' },
            { name: 'Tai Po' },
            { name: 'Tsuen Wan' },
            { name: 'Tuen Mun' },
            { name: 'Yuen Long' },
          ],
        },
        //
      ];
      if (locations.length) {
        for (const key in locations) {
          const state = locations[key];
          const { 0: abc } = await Database.table('locations').insert({
            name: state.name,
          });
          state.children = state.children.map(el => {
            el.parent_id = abc;
            return el;
          });
          await Database.table('locations').insert(state.children);
        }
      }
    } catch (error) {
      Logger.info('locations Seeder Catch %s', error);
    }
  }
}
module.exports = LocationsSeeder;
