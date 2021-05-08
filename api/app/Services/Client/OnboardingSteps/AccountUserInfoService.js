/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Logger = use('Logger');
const database = use('Database');
const Env = use('Env');
const Mail = use('Mail');
const Client = use('App/Models/Client');
const authService = make('App/Services/Auth/AuthService');

class AccountUserInfService {
  async getAccountUserInfo(userId) {
    try {
      const client = await Client.query()
        .select(
          'id',
          'first_name',
          'last_name',
          'slug',
          'home_telephone_number',
          'relation_with_service_user',
          'user_id',
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
        .where('user_id', userId)
        .first();

      return client;
    } catch (error) {
      Logger.info('Service getAccountUserInf Catch %s', error);
      throw error;
    }
  }

  async addAccountUserInfo(user, reqData) {
    const trx = await database.beginTransaction();
    try {
      let client = await user.client().fetch();
      if (!client) {
        client = new Client();
        client.current_step = 2;
      }
      if (reqData.isProfileCompleted === true) {
        client.home_telephone_number = reqData.home_telephone_number;
        user.mobile_number = reqData.mobile_number;
        await user.save(trx);

        if (client.current_step === '1') {
          client.current_step = '2';
        }
        await user.client().save(client, trx);
        await trx.commit();

        return client.slug;
      }
      if (user.email && reqData.email && reqData.email !== user.email) {
        user.email_temp = reqData.email;
        user.email_verification_token = await authService.generateDistinctRandomToken();
        process.nextTick(async () => {
          const activationLink = `${Env.get(
            'ACTIVATION_LINK',
          )}?update=true&token=${user.email_verification_token}`;
          await Mail.send(
            'email/confirm-email',
            { first_name: user.first_name, activationLink },
            mail => {
              mail
                .to(reqData.email)
                .from(Env.get('EMAIL_FROM'))
                .subject('Confirm Email - PureCare');
            },
          );
        });
      }

      user.salute = reqData.salute;
      user.mobile_number = reqData.mobile_number;
      user.preferred_communication_language =
        reqData.preferred_communication_language;
      await user.save(trx);

      client.first_name = reqData.first_name;
      client.last_name = reqData.last_name;
      client.home_telephone_number = reqData.home_telephone_number;
      if (reqData.relation_with_service_user) {
        client.relation_with_service_user = reqData.relation_with_service_user;
      }
      if (client.current_step === '1') {
        client.current_step = '2';
      }
      await user.client().save(client, trx);

      await trx.commit();

      return client.slug;
    } catch (error) {
      await trx.rollback();
      Logger.info('Service addAccountUserInf Catch %s', error);
      throw error;
    }
  }
}
module.exports = AccountUserInfService;
