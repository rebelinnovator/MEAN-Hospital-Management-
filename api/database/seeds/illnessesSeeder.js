'use strict';

/** @type {import('@adonisjs/lucid/src/Database')} */
const Logger = use('Logger');
const Illness = use('App/Models/Illness');

class IllnessesSeeder {
  /*
    |  You need to add the "static" modifier
    |  so you don't need to instantiate the class
    |  inside the "DatabaseSeeder", making the code
    |  easier to read and write.
    */
  static async run() {
    try {
      const illnesses = [
        { english_title: 'Asthma' },
        {
          english_title: 'Cancer',
          is_specific: true,
        },
        { english_title: 'Dementia' },
        { english_title: 'Diabetes' },
        { english_title: 'Epilepsy' },
        {
          english_title: 'Fracture',
          children: [
            { english_title: 'Wrist' },
            { english_title: 'Finger' },
            { english_title: 'Upper Arm' },
            { english_title: 'Lower Arm' },
            { english_title: 'Lower Body' },
            { english_title: 'Feet' },
            { english_title: 'Others', is_specific: true },
          ],
        },
        { english_title: 'Gout' },
        { english_title: 'Heart Failure' },
        {
          english_title: 'Hepatitis',
          children: [
            { english_title: 'Type A' },
            { english_title: 'Type B' },
            { english_title: 'Type C' },
            { english_title: 'Do not know' },
          ],
        },
        { english_title: 'Parkinsonism' },
        { english_title: 'Stroke' },
        { english_title: 'Scabies' },
        { english_title: 'Total Knee Replacement' },
      ];
      if (illnesses.length) {
        for (const item of illnesses) {
          const children = item.children || [];
          delete item.children;
          const illness = await Illness.create(item);
          if (children && children.length) {
            await illness.children().createMany(children);
          }
        }
      }
    } catch (error) {
      Logger.info('IllnessesSeeder Catch %s', error);
    }
  }
}
module.exports = IllnessesSeeder;
