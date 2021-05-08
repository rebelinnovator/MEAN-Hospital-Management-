const path = require('path');

const authService = make('App/Services/Auth/AuthService');
const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));
const Hash = use('Hash');
const Env = use('Env');
const Logger = use('Logger');
const Mail = use('Mail');

const userType = {
  Admin: '1',
  Caregiver: '2',
  Client: '3',
};

const userStatus = {
  Inactive: '0',
  Active: '1',
};

class AuthController {
  /**
   * Name: Nirav Goswami
   * Purpose: register new user in the system
   * Params: request, response
   * */
  async Register({ request, response }) {
    try {
      const userData = request.only(['email', 'password', 'user_type']);

      const user = await authService.createUser(userData);

      if (user.user_type == userType.Caregiver) {
        // caregiver
        await authService.insertRegistrationNo(user.id);
      }

      if (user.user_type == userType.Client) {
        // entry to Client table
        await authService.insertClient(user.id);
      }

      const activationLink = `${Env.get('ACTIVATION_LINK')}?token=${
        user.email_verification_token
        }&user_type=${user.user_type}`;

      await Mail.send(
        'email/confirm-email',
        { first_name: user.first_name, activationLink },
        mail => {
          mail
            .to(user.email)
            .from(Env.get('EMAIL_FROM'))
            .subject('確認電郵 Confirm Email');
        },
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.REGISTERED,
      });
    } catch (error) {
      Logger.info('Register Controller Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: register new user in the system by Admin
   * Params: request, response
   * */
  async RegisterByAdmin({ request, response }) {
    try {
      const userData = request.only(['email', 'password', 'user_type']);
      userData.status = userStatus.Active; // active as added by admin

      const user = await authService.createUser(userData);

      if (user.user_type == userType.Caregiver) {
        const caregiver = await authService.insertRegistrationNo(user.id);
        return util.sendSuccessResponse(response, {
          success: true,
          ...message.CAREGIVER_REGISTERED,
          data: { registration_no: caregiver.registration_no },
        });
      }
      if (user.user_type == userType.Client) {
        // entry to Client table
        await authService.insertClient(user.id);
      }
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.CLIENT_REGISTERED,
      });
    } catch (error) {
      Logger.info('Register Controller Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Nirav Goswami
   * Purpose: confirm email for registerd user and activate them
   * Params: request, response
   * */
  async confirmEmail({ request, response }) {
    try {
      const reqData = request.only(['token', 'update']);
      const user = await authService.getUser({
        email_verification_token: reqData.token,
      });
      if (!user) {
        const confirmedEmail = await util.sendErrorResponse(
          response,
          message.CONFIRMED_EMAIL,
        );
        return confirmedEmail;
      }
      const updateData = {};
      if (reqData.update) {
        updateData.email = user.email_temp;
        updateData.email_temp = '';
      }
      updateData.status = userStatus.Active;
      updateData.email_verification_token = null;
      const isActivated = await authService.activateUser(user.id, updateData);
      if (isActivated) {
        return util.sendSuccessResponse(response, {
          success: true,
          ...message.CONFIRM_EMAIL,
          data: { user_type: user.user_type },
        });
      }
    } catch (error) {
      Logger.info('confirmEmail Controller Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: resend confirmation link to the registered user
   * Params: request, response
   * */
  async resendConfirmEmail({ request, response }) {
    try {
      const { email } = request.only(['email']);
      const user = await authService.getUser({ email });
      if (!user) {
        return await util.sendErrorResponse(response, message.EMAIL_NOT_FOUND);
      }
      if (user.status == userStatus.Active) {
        // Already active user
        return await util.sendErrorResponse(response, message.CONFIRMED_EMAIL);
      }

      const activationLink = `${Env.get('ACTIVATION_LINK')}?token=${
        user.email_verification_token
        }&user_type=${user.user_type}`;

      await Mail.send(
        'email/confirm-email',
        { first_name: user.first_name, activationLink },
        mail => {
          mail
            .to(user.email)
            .from(Env.get('EMAIL_FROM'))
            .subject('確認電郵 Confirm Email');
        },
      );

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.REGISTERED,
      });
    } catch (error) {
      Logger.info('Register Controller Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get logged in user based on user type
   * Params: email, type
   * */
  async getUser(email, user_type) {
    let user;
    if (user_type == userType.Caregiver) {
      user = await authService.getCaregiver({ email, user_type });
      if (user) {
        user = user.toJSON();
      }
    } else if (user_type == userType.Client) {
      user = await authService.getClient({ email, user_type });
      if (user) {
        user = user.toJSON();
      }
    } else {
      user = await authService.getUser({ email, user_type });
    }
    return user;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: login in the system and generate jwt token
   * Params: request, auth, response
   * */
  async login({ request, auth, response }) {
    try {
      const browser_fingerprint = request.header('device-id');
      if (!browser_fingerprint) {
        return util.sendErrorResponse(
          response,
          message.BROWSER_FINGERPRINT_REQUIRED,
        );
      }
      const { email, password, user_type = '1' } = request.only([
        'email',
        'password',
        'user_type',
      ]);
      const user = await this.getUser(email, user_type);
      if (!user) {
        if (user_type == '1') {
          return util.sendErrorResponse(
            response,
            message.INVALID_USER_OR_PASSWORD_ADMIN,
          );
        }
        return util.sendErrorResponse(
          response,
          message.INVALID_USER_OR_PASSWORD,
        );
      }
      if (user.status == userStatus.Inactive) {
        // Inactive User
        return util.sendErrorResponse(response, message.INACTIVE_USER);
      }
      // verify passowrd
      if (!(await Hash.verify(password, user.password))) {
        if (user_type == '1') {
          return util.sendErrorResponse(
            response,
            message.INVALID_USER_OR_PASSWORD_ADMIN,
          );
        }
        return util.sendErrorResponse(
          response,
          message.INVALID_USER_OR_PASSWORD,
        );
      }
      // generate token
      const accessToken = await auth.generate({ id: user.id }, { browser_fingerprint });
      const data = {};
      data.accessToken = accessToken;
      data.user_id = user.id;
      data.email = user.email;

      if (user.user_type === userType.Caregiver) {
        data.registration_no = user.caregiver.registration_no;
        data.caregiver_type = user.caregiver.caregiver_type;
        data.current_step = user.caregiver.current_step;
        data.english_name = user.caregiver.english_name;
        data.chinese_name = user.caregiver.chinese_name;
      } else if (user.user_type == userType.Client) {
        if (user.client) {
          data.slug = user.client.slug;
          data.current_step = user.client.current_step;
          data.first_name = user.client.first_name;
          data.last_name = user.client.last_name;
        } else {
          data.current_step = 1;
        }
      }

      return util.sendSuccessResponse(response, {
        success: true,
        ...message.LOGIN,
        data,
      });
    } catch (error) {
      Logger.info('Login Controller Catch %s', error);
      return util.sendErrorResponse(response, { data: error });
    }
  }
}

module.exports = AuthController;
