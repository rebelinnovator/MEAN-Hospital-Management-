/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Logger = use('Logger');
const database = use('Database');
const Client = use('App/Models/Client');

class ServiceUserInfService {
  async getServiceUserMedHistory(clientId) {
    try {
      const client = await Client.query()
        .where('id', clientId)
        .select('id', 'slug', 'service_user_other_medical_history')
        .with('illness', query => {
          query
            .select('id', 'english_title', 'is_specific')
            .withPivot('specific_title');
        })
        .first();

      return client;
    } catch (error) {
      Logger.info('Service getServiceUserMedHistory Catch %s', error);
      throw error;
    }
  }

  async addServiceUserMedHistory(client, reqData) {
    const trx = await database.beginTransaction();
    try {
      client.service_user_other_medical_history =
        reqData.service_user_other_medical_history;
      if (client.current_step === '4') {
        client.current_step = '5';
      }
      await client.save(trx);
      const illnesses = reqData.illnesses.map(i => i.illness_id);
      if (illnesses && illnesses.length) {
        await client.illness().sync(
          illnesses,
          row => {
            const reqRow = reqData.illnesses.find(
              i => i.illness_id === row.illness_id,
            );
            if (reqRow.specific_title) {
              row.specific_title = reqRow.specific_title;
            }
          },
          trx,
        );
      } else {
        await client.illness().detach(null, trx);
      }
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service addServiceUserMedHistory Catch %s', error);
      throw error;
    }
  }
}
module.exports = ServiceUserInfService;
