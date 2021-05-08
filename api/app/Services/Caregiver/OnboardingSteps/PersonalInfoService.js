/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Logger = use('Logger');
const database = use('Database');
const Env = use('Env');
const Mail = use('Mail');
const Caregiver = use('App/Models/Caregiver');
const authService = make('App/Services/Auth/AuthService');
const path = require('path');

const message = require(path.resolve('app/Constants/Response/index'));

class PersonalInfoService {
  async getPersonalInfo(caregiverId) {
    try {
      const getcaregiver = await Caregiver.query()
        .select(
          'id',
          'chinese_name',
          'english_name',
          'nick_name',
          'hkid_card_no',
          'user_id',
          'caregiver_type',
          'registration_no',
          'refferers_email',
          'tnc_accepted_date',
          'current_step'
        )
        .with('user', query => {
          query.select(
            'id',
            'dob',
            'salute',
            'email',
            'preferred_communication_language',
            'mobile_number',
            'is_deleted',
          );
        })
        .with('languages', query => {
          query.select('caregiver_id', 'language', 'other_lang');
        })
        .where('id', caregiverId)
        .first();

      return getcaregiver;
    } catch (error) {
      Logger.info('Service getPersonalInfo Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: To check if referral email exists in our db or not
   * Params: email
   * */
  async checkEmail(email) {
    const emailStatus = await database
      .from('users')
      .where('email', email)
      .first();
    return emailStatus;
  }

  async addPersonalInfo(caregiver, reqData) {
    const trx = await database.beginTransaction();
    try {
      const user = await caregiver.user().fetch();
      if (user.email && reqData.email && reqData.email !== user.email) {
        const emailExists = await this.checkEmail(reqData.email);
        if (emailExists) {
          throw message.EMAIL_ALREADY_REGISTERED;
        }
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
      user.dob = reqData.dob;
      user.mobile_number = reqData.mobile_number;
      user.preferred_communication_language =
        reqData.preferred_communication_language;
      await user.save(trx);

      caregiver.chinese_name = reqData.chinese_name;
      caregiver.english_name = reqData.english_name;
      caregiver.nick_name = reqData.nick_name;
      caregiver.hkid_card_no = reqData.hkid_card_no;
      caregiver.caregiver_type = reqData.caregiver_type;
      caregiver.refferers_email = reqData.refferers_email;
      if (caregiver.current_step === '1') {
        caregiver.current_step = '2';
      }
      await caregiver.save(trx);

      await caregiver.languages().delete(trx);
      await caregiver.languages().createMany(reqData.languages, trx);
      await trx.commit();
      return caregiver;
    } catch (error) {
      await trx.rollback();
      Logger.info('Service addPersonalInfo Catch %s', error);
      throw error;
    }
  }
}
module.exports = PersonalInfoService;
