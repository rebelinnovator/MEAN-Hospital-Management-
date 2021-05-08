// Libraries
const Logger = use('Logger');
const Database = use('Database');

// Models
const User = use('App/Models/User');
const Caregiver = use('App/Models/Caregiver');
const UserRefferal = use('App/Models/UserRefferal');

class UserService {
  /**
   * Name: Nirav Goswami
   * Purpose: To check if user is exists or not
   * Params: userId
   * */
  async checkUser(userId) {
    return User.find(userId);
  }

  /**
   * Name: Nirav Goswami
   * Purpose: To get referral bonus for the user
   * Params: user
   * */
  async getReferralBonus(data) {
    try {
      const returnData = {
        due: 0,
        earned: 0,
        paid: 0,
        caregivers_reffered: 0,
      };

      const user = await data.user().fetch();
      returnData.caregivers_reffered = await Caregiver.query()
        .where('refferers_email', user.email)
        .getCount();

      const earnedAmount = await UserRefferal.query()
        .select(Database.raw('sum(amount) as earned'))
        .whereNull('paid_at')
        .where('type', '1')
        .where('user_id', user.id)
        .first();
      returnData.earned = earnedAmount.earned > 0 ? earnedAmount.earned : 0;

      const paidAmount = await UserRefferal.query()
        .select(Database.raw('sum(amount) as paid'))
        .whereNotNull('paid_at')
        .where('type', '2')
        .where('user_id', user.id)
        .first();
      returnData.paid = paidAmount.paid > 0 ? paidAmount.paid : 0;

      returnData.due = returnData.earned - returnData.paid;

      return returnData;
    } catch (error) {
      Logger.info('Service getReferralBonus Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: To check if payable amount is not more than due amount
   * Params: userId
   * */
  async checkDueAmount(userId) {
    const earnedAmount = await UserRefferal.query()
      .select(Database.raw('sum(amount) as earned'))
      .whereNull('paid_at')
      .where('type', '1')
      .where('user_id', userId)
      .first();
    const earned = earnedAmount.earned > 0 ? earnedAmount.earned : 0;
    const paidAmount = await UserRefferal.query()
      .select(Database.raw('sum(amount) as paid'))
      .whereNotNull('paid_at')
      .where('type', '2')
      .where('user_id', userId)
      .first();
    const paid = paidAmount.paid > 0 ? paidAmount.paid : 0;
    const due = earned - paid;
    return due;
  }

  /**
   * Name: Jainam Shah
   * Purpose: pay referral bonus to user by admin
   * Params: userId, amount, date
   * */
  async payReferralAmount(userId, amount, date) {
    try {
      const data = new UserRefferal();
      data.user_id = userId;
      data.amount = amount;
      data.paid_at = date;
      data.type = '2';
      await data.save();

      const user = await this.checkUser(userId);
      user.due_amount = await this.checkDueAmount(userId);
      user.save();
    } catch (error) {
      Logger.info('payReferralAmount UserService Catch %s', error);
    }
  }

  async deleteUser(user) {
    try {
      const userIds = await User.query()
        .whereIn('id', [user])
        .fetch();
      const deleteIds = [];
      userIds.toJSON().filter(e => {
        if (+e.is_deleted === 0 && e.user_type !== '1') deleteIds.push(e.id);
      });
      if (deleteIds.length) {
        const deleteMark = `-deleted-${Date.now()}`;
        const deleteuser = await Database.raw(
          `update users set email = CONCAT(email, '${deleteMark}'), is_deleted = 1, deleted_at = now(), updated_at = now() where id in (${deleteIds.join(
            ',',
          )})`,
        );
        return deleteuser;
      }
      return true;
    } catch (error) {
      Logger.info(' deleteuser Catch %s', error);
      throw error;
    }
  }
}

module.exports = UserService;
