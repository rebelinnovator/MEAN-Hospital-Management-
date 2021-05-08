/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Logger = use('Logger');
const database = use('Database');
const Client = use('App/Models/Client');

class ServiceUserBackgroundService {
  /**
   * Name: Jainam Shah
   * Purpose: To get service user background data for a client
   * Params: client_id
   * */
  async getUserBackground(clientId) {
    try {
      const client = await Client.query()
        .select(
          'id',
          'slug',
          'service_user_weight',
          'service_user_height',
          'service_user_lastname',
          'service_user_diet',
          'service_user_physical_ability',
          'service_user_eye_sight',
          'service_user_hearing',
          'service_user_lifting',
          'service_user_lifting_specific',
          'service_user_lower_left_leg_limb_mobility',
          'service_user_lower_right_leg_limb_mobility',
          'service_user_left_hand_mobility',
          'service_user_right_hand_mobility',
          'service_user_assisting_device',
        )
        .with('otherDevices')
        .with('languages')
        .with('selfCareAbilities')
        .where('id', clientId)
        .first();

      return client;
    } catch (error) {
      Logger.info('Service getUserBackground Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update service user background data of a client
   * Params: client, clientData, languagesData, selfCareAbilitiesData, otherDevices
   * */
  async addUpdateUserBackground(
    client,
    clientData,
    langData,
    selfCareData,
    otherDevices,
  ) {
    const trx = await database.beginTransaction();
    try {
      if (client.current_step === '3') {
        clientData.current_step = '4';
      }
      client.merge(clientData);
      await client.save(trx);

      // modify languages
      if (langData.languages && langData.languages.length) {
        const { languages } = langData;
        if (langData.other_lang) {
          const dialectLang = languages.find(lang => lang.language === 4);
          dialectLang ? (dialectLang.other_lang = langData.other_lang) : '';
        }
        await this.modifyLanguages(client, languages, trx);
      }

      // modify self care abilities
      if (
        selfCareData.selfCareAbilities &&
        selfCareData.selfCareAbilities.length
      ) {
        const abilities = selfCareData.selfCareAbilities;
        await this.modifyselfCareAbilities(client, abilities, trx);
      }

      // modify other devices
      let otherDevicesData = [];
      if (otherDevices.other_devices && otherDevices.other_devices.length) {
        otherDevicesData = otherDevices.other_devices;
        if (otherDevices.specific_drug) {
          const specificDrug = otherDevicesData.find(
            device => device.other_device === 4,
          );
          specificDrug
            ? (specificDrug.specific_drug = otherDevices.specific_drug)
            : '';
        }
      }
      await this.modifyOtherDevices(client, otherDevicesData, trx);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service addUpdateUserBackground Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update languages of a client (one or more)
   * Params: languages data
   * */
  async modifyLanguages(client, data, trx) {
    await client.languages().delete(trx);
    await client.languages().createMany(data, trx);
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update other background devices of a client (one or more)
   * Params: other devices data
   * */
  async modifyOtherDevices(client, data, trx) {
    await client.otherDevices().delete(trx);
    if (data && data.length) {
      await client.otherDevices().createMany(data, trx);
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update selfcare abilities of a client (one or more)
   * Params: selfcare abilities data
   * */
  async modifyselfCareAbilities(client, data, trx) {
    await client.selfCareAbilities().sync(data, null, trx);
  }
}
module.exports = ServiceUserBackgroundService;
