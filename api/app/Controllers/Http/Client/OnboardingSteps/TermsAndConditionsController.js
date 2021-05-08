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
   * Purpose: get terms and conditions data of a client
   * Params: request, response
   * */
  async getClientTncInfo({ request, response }) {
    try {
      const client = request.client;
      const data = {
        slug: client.slug,
        hkid_name: client.hkid_name,
        tnc_accepted_date: client.tnc_accepted_date,
      };

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: send terms and conditions email to user
   * Params: request, response
   * */
  async sendTermsAndConditionsMail({ request, response }) {
    try {
      const reqData = await request.all();
      const client = request.client;
      const user = await client.user().fetch();

      // Saving to data to client
      client.hkid_name = reqData.hkid_name;
      client.tnc_accepted_date = reqData.tnc_accepted_date;
      if (client.current_step === '5') {
        client.current_step = null;
      }
      await client.save();

      // TNC Mail depending on user's preferred language
      await Mail.send(
        user.preferred_communication_language === language.Chinese
          ? 'email/ch/tnc-client'
          : 'email/en/tnc-client',
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
