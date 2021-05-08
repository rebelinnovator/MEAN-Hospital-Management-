'use strict';

// Libraries
const path = require('path');

const Mail = use('Mail');
const Env = use('Env');

// Services
const util = make('App/Services/Common/UtilService');

// Constants
const message = require(path.resolve('app/Constants/Response/index'));

const language = {
  Chinese: '1',
  English: '2',
};

class TermsAndConditionsController {
  /**
   * Name: Jainam Shah
   * Purpose: send terms and conditions email to user
   * Params: request, response
   * */
  async sendTermsAndConditionsMail({ request, response }) {
    try {
      const reqData = await request.all();
      const caregiver = request.caregiver;

      const user = await caregiver.user().fetch();

      // Saving to data to caregiver
      caregiver.hkid_name = reqData.hkid_name;
      caregiver.tnc_accepted_date = reqData.tnc_accepted_date;
      if (caregiver.current_step === '6') {
        caregiver.current_step = null;
      }
      await caregiver.save();

      // TNC Mail depending on user's preferred language
      await Mail.send(
        user.preferred_communication_language === language.Chinese
          ? 'email/ch/tnc-caregiver'
          : 'email/en/tnc-caregiver',
        { name: reqData.hkid_name, date: reqData.tnc_accepted_date },
        mail => {
          mail
            .to(user.email)
            .from(Env.get('EMAIL_FROM'))
            .subject('條款及細則 Terms and Conditions');
        },
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = TermsAndConditionsController;
