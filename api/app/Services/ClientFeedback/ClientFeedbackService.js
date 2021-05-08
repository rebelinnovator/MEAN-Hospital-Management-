// Libraries
const path = require('path');

const database = use('Database');
const Logger = use('Logger');

// Services
const userService = make('App/Services/User/UserService');
const message = require(path.resolve('app/Constants/Response/index'));

// Models
const Booking = use('App/Models/CaregiverBooking');
const Caregiver = use('App/Models/Caregiver');
const User = use('App/Models/User');
const UserRefferral = use('App/Models/UserRefferal');
const ClientFeedbacks = use('App/Models/ClientFeedbacks');
const SystemSetting = use('App/Models/SystemSetting');

// Constants
const util = make('App/Services/Common/UtilService');

class ClientFeedbackService {
  /**
   * Name: Jainam Shah
   * Purpose: to check feedback exists or not
   * Params: booking_id
   * */
  async checkFeedback(bookingId) {
    const clientfeedback = await ClientFeedbacks.findBy(
      'caregiver_booking_id',
      bookingId,
    );
    return clientfeedback;
  }

  async removeFeedback(reqData, response) {
    const trx = await database.beginTransaction();
    try {
      const clientfeedback = await ClientFeedbacks.find(reqData.id);
      if (!clientfeedback) {
        return await util.sendErrorResponse(
          response,
          message.CLIENT_FEEDBACK_NOT_FOUND,
        );
      }

      clientfeedback.is_deleted = 1;
      await clientfeedback.save(trx);

      await this.avgRating(
        clientfeedback.caregiver_id,
        clientfeedback,
        'remove',
        trx,
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service removeFeedback Catch %s', error);
      throw error;
    }
  }

  async addFeedback(reqData, checkAccepted) {
    const trx = await database.beginTransaction();
    try {
      const feedbacks = new ClientFeedbacks();
      (feedbacks.caregiver_booking_id = reqData.booking_id),
        (feedbacks.caregiver_id = reqData.caregiver_id),
        (feedbacks.client_id = reqData.client_id),
        (feedbacks.rating = reqData.rating),
        (feedbacks.positive_feedback = reqData.positive_feedback),
        (feedbacks.negative_feedback = reqData.negative_feedback),
        await feedbacks.save(trx);

      const setting = await SystemSetting.findBy('title', 'caregiver_referral');

      if (!reqData.negative_feedback && Number(setting.toJSON().value) > 0) {
        let caregiver = await Caregiver.query()
          .where('id', reqData.caregiver_id)
          .with('feedbacks')
          .with('referrals')
          .first();

        caregiver = caregiver.toJSON();

        let booking = await Booking.query()
          .where('id', reqData.booking_id)
          .first();
        booking = booking.toJSON();

        // check if his this is his first 3 event or not
        if (caregiver.refferers_email && Number(booking.completion_count) < 4) {
          const user = await User.findBy('email', caregiver.refferers_email);

          if (user) {
            const userReferralData = {
              caregiver_booking_id: reqData.booking_id,
              caregiver_id: caregiver.id,
              user_id: user.id,
              amount:
                Number(checkAccepted.caregiver_service_fee) +
                Number(checkAccepted.client_service_fee),
              type: '1',
            };
            await UserRefferral.query()
              .transacting(trx)
              .insert(userReferralData);
            // for due amount
            user.due_amount = await userService.checkDueAmount(user.id);
            // add userReferralData amount to due_amount
            // as userReferralData not reflect in DB now (save after commit)
            user.due_amount += userReferralData.amount;
            await user.save(trx);
          }
        }
      }

      await this.avgRating(reqData.caregiver_id, feedbacks, 'add', trx);
      await trx.commit();
      return feedbacks;
    } catch (error) {
      await trx.rollback();
      Logger.info('Service addFeedback Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: To save avg rating of a caregiver
   * Params: request
   * */
  async avgRating(caregiverId, feedback, type, trx) {
    const caregiverFeedbacks = await ClientFeedbacks.query()
      .where('caregiver_id', caregiverId)
      .where('is_deleted', '0')
      .fetch();

    let TotalRating = 0;
    let feedbackCount = 0;
    caregiverFeedbacks.toJSON().map(e => {
      TotalRating += Number(e.rating);
    });
    if (type === 'add') {
      TotalRating += Number(feedback.rating);
      feedbackCount = caregiverFeedbacks.toJSON().length + 1;
    }
    if (type === 'remove') {
      TotalRating -= Number(feedback.rating);
      feedbackCount = caregiverFeedbacks.toJSON().length - 1;
    }
    const avgRating =
      TotalRating && feedbackCount ? TotalRating / feedbackCount : 0;
    const care = await Caregiver.find(caregiverId);
    care.avg_rating = avgRating;
    await care.save(trx);
  }
}
module.exports = ClientFeedbackService;
