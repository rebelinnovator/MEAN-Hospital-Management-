/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Logger = use('Logger');
const database = use('Database');
const Client = use('App/Models/Client');

class ServiceUserInfService {
  async getServiceUserInfo(clientId) {
    try {
      const client = await Client.query()
        .select(
          'id',
          'user_id',
          'slug',
          'service_user_salute',
          'service_user_firstname',
          'service_user_lastname',
          'service_user_dob',
          'servive_user_home_telephone',
          'service_user_mobile',
          'service_user_flat_no',
          'service_user_floor_no',
          'service_user_building_name',
          'service_user_street_name_number',
          'service_user_district',
        )
        .with('user', query => {
          query.select(
            'id',
            'salute',
            'email',
            'preferred_communication_language',
            'mobile_number',
            'is_deleted',
          );
        })
        .where('id', clientId)
        .first();

      return client;
    } catch (error) {
      Logger.info('Service getServiceUserInf Catch %s', error);
      throw error;
    }
  }

  async addServiceUserInfo(client, reqData) {
    const trx = await database.beginTransaction();
    try {
      delete reqData.slug;
      if (client.current_step === '2') {
        reqData.current_step = '3';
      } else if (client.current_step === null) {
        delete reqData.service_user_salute;
        delete reqData.service_user_firstname;
        delete reqData.service_user_lastname;
        delete reqData.service_user_dob;
      }
      client.merge(reqData);
      await client.save(trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service addServiceUserInfo Catch %s', error);
      throw error;
    }
  }
}
module.exports = ServiceUserInfService;
