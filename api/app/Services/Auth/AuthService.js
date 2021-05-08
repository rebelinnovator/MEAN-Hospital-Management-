const randtoken = require('rand-token');

const Hash = use('Hash');
const database = use('Database');
const User = use('App/Models/User');
const moment = require('moment');

const Caregiver = use('App/Models/Caregiver');
const Client = use('App/Models/Client');

class AuthService {
  /**
   * Name: Nirav Goswami
   * Purpose: create a user for the system
   * Params: user table required data
   * */
  async createUser(userData) {
    const user = new User();
    user.email = userData.email;
    user.password = await Hash.make(userData.password);
    user.user_type = userData.user_type;
    if (!userData.status) {
      user.email_verification_token = await this.generateDistinctRandomToken();
    } else {
      user.status = userData.status;
    }
    await user.save();

    return user;
  }

  // insert Registration No
  async insertRegistrationNo(userId) {
    const number = await database
      .from('caregivers')
      .max('registration_no as maxreg');
    const registrationNo = !number[0].maxreg ? 500 : number[0].maxreg + 1;
    const caregiver = new Caregiver();
    caregiver.registration_no = registrationNo;
    caregiver.user_id = userId;
    await caregiver.save();
    return caregiver;
  }

  async insertClient(userId) {
    const client = new Client();
    client.user_id = userId;
    await client.save();
    return client;
  }

  async getUser(where) {
    const user = database
      .from('users')
      .where(where)
      .first();
    return user;
  }

  /**
   * Name: Jainam Shah
   * Purpose: get caregiver data on login
   * Params: email, user_type
   * */
  async getCaregiver(where) {
    const user = User.query()
      .with('caregiver')
      .where(where)
      .first();
    return user;
  }

  /**
   * Name: Jainam Shah
   * Purpose: get client data on login
   * Params: email, user_type
   * */
  async getClient(where) {
    const user = User.query()
      .with('client')
      .where(where)
      .first();
    return user;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: activate user account for the system
   * Params: user_id
   * */
  async activateUser(id, data) {
    const user = await database
      .table('users')
      .where({ id })
      .update(data);
    return user;
  }

  /**
   * Generates DB Distinct Random email_verification_token
   */
  async generateDistinctRandomToken() {
    const token = randtoken.generate(24);
    const emailToken = await User.query()
      .where('email_verification_token', token)
      .first();
    if (emailToken) {
      this.generateDistinctRandomString();
    }
    return token;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: to generate reset password token and check old token 24 hours condition
   * Params: user_id
   * */
  async generateResetPasswordToken(id) {
    const tokenData = await database
      .from('password_resets')
      .where('user_id', id)
      .where(
        'created_at',
        '>=',
        moment()
          .subtract(1, 'days')
          .format(),
      )
      .first();
    let token;
    if (tokenData) {
      token = tokenData.token;
    } else {
      token = await randtoken.generate(24);
      await database
        .table('password_resets')
        .where('user_id', id)
        .delete();
      await database.table('password_resets').insert({ user_id: id, token });
    }
    return token;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: to check reset password token 24 hours condition
   * Params: token
   * */
  async getResetPasswordToken({ token }) {
    const userToken = await database
      .from('password_resets')
      .where('token', token)
      .where(
        'created_at',
        '>=',
        moment()
          .subtract(1, 'days')
          .format(),
      )
      .first();
    return userToken;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: to update password for the specified user
   * Params: user_id, password (new)
   * */
  async updatePassword({ id, password }) {
    const passwordData = await Hash.make(password);
    await database
      .table('users')
      .where({ id })
      .update('password', passwordData);
  }

  /**
   * Name: Nirav Goswami
   * Purpose: to delete reset password token from the system
   * Params: user_id
   * */
  async deleteResetPasswordToken({ id }) {
    await database
      .table('password_resets')
      .where({ user_id: id })
      .delete();
  }
}

module.exports = AuthService;
