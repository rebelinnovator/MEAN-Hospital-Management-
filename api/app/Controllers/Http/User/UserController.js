'use strict';

// Libraries
const path = require('path');

const Mail = use('Mail');
const Env = use('Env');

// Services
const message = require(path.resolve('app/Constants/Response/index'));
const userService = make('App/Services/User/UserService');
const clientService = make('App/Services/Client/ClientService');
const caregiverService = make('App/Services/Caregiver/CaregiverService');

// Constants
const util = make('App/Services/Common/UtilService');

const msgs = {
  client: 'client',
  caregiver: 'caregiver',
  chinese: '1',
  english: '2',
};

class UserController {
  /**
   * Name: Jainam Shah
   * Purpose: get referral bonus for the client
   * Params: request, response
   * */
  async getReferralBonus({ request, response }) {
    try {
      const reqData = await request.all();

      let user;
      if (reqData.for === msgs.client) {
        // check if client exists or not
        user = await clientService.checkClientBySlug(reqData.slug);
        if (!user) {
          return await util.sendErrorResponse(
            response,
            message.CLIENT_NOT_FOUND,
          );
        }
      } else if (reqData.for === msgs.caregiver) {
        // check if caregiver exists or not
        user = await caregiverService.checkCaregiver(reqData.registration_no);
        if (!user) {
          return await util.sendErrorResponse(
            response,
            message.CAREGIVER_NOT_FOUND,
          );
        }
      }

      const data = await userService.getReferralBonus(user);
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
   * Purpose: pay referral amount to user
   * Params: request, response
   * */
  async payReferralAmount({ request, response }) {
    try {
      const reqData = await request.all();

      // check if user exists or not
      const user = await userService.checkUser(reqData.user_id);
      if (!user) {
        return await util.sendErrorResponse(response, message.USER_NOT_FOUND);
      }

      const dueAmount = await userService.checkDueAmount(user.id);
      if (reqData.amount > dueAmount) {
        return await util.sendErrorResponse(
          response,
          message.LESSER_DUE_AMOUNT,
        );
      }

      await userService.payReferralAmount(
        user.id,
        reqData.amount,
        reqData.date,
      );

      const mailData = { email: user.email };

      // Sending mail to CAREGIVER / CLIENT for payment received (Paid)
      Mail.send(
        user.preferred_communication_language === msgs.chinese
          ? 'email.ch.paid-by-admin-caregiver'
          : 'email.en.paid-by-admin-caregiver',
        mailData,
        mail => {
          mail
            .to(mailData.email)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              user.preferred_communication_language === msgs.chinese
                ? '已入數'
                : 'Paid',
            );
        },
      );

      // sending whatsapp message to CAREGIVER / CLIENT for payment received (Paid)
      await util.sendWhatsAppMessage(
        user.mobile_number,
        '岩岩已經過左數比你啦! 麻煩你睇下銀行户口確認啦!',
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async deleteUser({ request, response }) {
    try {
      const reqData = await request.all();
      await userService.deleteUser(reqData.user);
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}
module.exports = UserController;
