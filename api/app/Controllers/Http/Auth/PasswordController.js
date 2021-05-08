// Libraries
const Env = use('Env');
const Mail = use('Mail');
const path = require('path');

const Hash = use('Hash');

// Services
const util = make('App/Services/Common/UtilService');
const authService = make('App/Services/Auth/AuthService');
const caregiverService = make('App/Services/Caregiver/CaregiverService');
const clientService = make('App/Services/Client/ClientService');

// Constants
const message = require(path.resolve('app/Constants/Response/index'));

const userType = {
  Admin: '1',
  Caregiver: '2',
  Client: '3',
};

class PasswordController {
  /**
   * Name: Nirav Goswami
   * Purpose: Send user reset password link to reset his account's password
   * Params: request, response
   * */
  async forgotPassword({ request, response }) {
    try {
      const { email } = request.only(['email']);
      const user = await authService.getUser({ email });
      if (!user) {
        return await util.sendErrorResponse(response, message.EMAIL_NOT_FOUND);
      }
      if (user && !user.status) {
        return await util.sendErrorResponse(response, message.INACTIVE_USER);
      }
      const token = await authService.generateResetPasswordToken(user.id);

      const resetPasswordLink = `${Env.get(
        'RESET_PASSWORD_LINK',
      )}?token=${token}`;

      await Mail.send(
        'email/reset-password-email',
        { first_name: user.first_name, resetPasswordLink },
        mail => {
          mail
            .to(user.email)
            .from(Env.get('EMAIL_FROM'))
            .subject('重置密碼 Reset Password');
        },
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.PASSWORD_RESET,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Nirav Goswami
   * Purpose: To reset user's account password from reset password link within 24 hours
   * Params: request, response
   * */
  async resetPassword({ request, response }) {
    try {
      const { token, password } = request.only(['token', 'password']);
      const tokenData = await authService.getResetPasswordToken({ token });
      if (!tokenData) {
        return await util.sendErrorResponse(
          response,
          message.INVALID_RESET_TOKEN,
        );
      }
      const user = await authService.getUser({ id: tokenData.user_id });
      if (!user) {
        return await util.sendErrorResponse(response, message.USER_NOT_FOUND);
      }
      await authService.updatePassword({ id: user.id, password });
      await authService.deleteResetPasswordToken({ id: user.id });
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.CHANGE_PASSWORD,
        data: { user_type: user.user_type },
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: To change existing password for a user
   * Params: request, auth, response
   * */
  async changePassword({ request, response }) {
    try {
      const reqData = await request.all();

      let user;
      switch (reqData.user_type) {
        case userType.Admin: {
          // if admin exists or not
          user = await authService.getUser({ id: reqData.id });
          if (!user) {
            return await util.sendErrorResponse(
              response,
              message.USER_NOT_FOUND,
            );
          }
          break;
        }
        case userType.Caregiver: {
          // if caregiver exists or not
          const caregiver = await caregiverService.checkCaregiver(
            reqData.registration_no,
          );
          if (!caregiver) {
            return await util.sendErrorResponse(
              response,
              message.CAREGIVER_NOT_FOUND,
            );
          }
          user = await caregiver.user().fetch();
          break;
        }
        case userType.Client: {
          // if client exists or not
          const client = await clientService.checkClientBySlug(reqData.slug);
          if (!client) {
            return await util.sendErrorResponse(
              response,
              message.CLIENT_NOT_FOUND,
            );
          }
          user = await client.user().fetch();
          break;
        }
        default: {
          return await util.sendErrorResponse(response, message.USER_NOT_FOUND);
        }
      }

      // check if old_password is correct or not
      const checkPwd = await Hash.verify(reqData.old_password, user.password);
      if (!checkPwd) {
        return await util.sendErrorResponse(
          response,
          message.INCORRECT_PASSWORD,
        );
      }

      if (reqData.user_type === userType.Admin) {
        await authService.updatePassword({
          id: reqData.id,
          password: reqData.password,
        });
      } else {
        user.password = await Hash.make(reqData.password);
        await user.save();
      }

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.CHANGE_PASSWORD,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = PasswordController;
