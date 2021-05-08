// Libraries
const Logger = use('Logger');
const database = use('Database');

// Models
const Caregiver = use('App/Models/Caregiver');
const CaregiverCharges = use('App/Models/CaregiverCharges');

class ChargeService {
  /**
   * Name: Jainam Shah
   * Purpose: To get charges and bank details for a caregiver
   * Params: caregiver_id
   * */
  async getCharges(caregiverId) {
    const charges = await Caregiver.query()
      .select(
        'id',
        'fps_mobile_number',
        'bank_name',
        'bank_code',
        'branch_code',
        'account_no',
        'account_name',
        'payment_method_online',
        'payment_method_cheque',
      )
      .where('id', caregiverId)
      .with('charges', query => {
        query.select('id', 'caregiver_id', 'hour', 'price');
      })
      .first();
    return charges;
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update/delete charges of a caregiver (one or more)
   * Params: caregiver, reqData
   * */
  async addUpdateCharges(caregiver, reqData) {
    const trx = await database.beginTransaction();
    try {
      if (reqData.payment_method_online) {
        caregiver.fps_mobile_number = reqData.fps_mobile_number;
        caregiver.bank_name = reqData.bank_name;
        caregiver.bank_code = reqData.bank_code;
        caregiver.branch_code = reqData.branch_code;
        caregiver.account_no = reqData.account_no;
        caregiver.account_name = reqData.account_name;
      }
      caregiver.payment_method_online = reqData.payment_method_online;
      caregiver.payment_method_cheque = reqData.payment_method_cheque;
      if (caregiver.current_step === '5') {
        caregiver.current_step = '6';
      }
      await caregiver.save(trx);

      const { charges } = reqData;
      const deletedCharges = reqData.deleted_charges;

      // update data which has id
      const updateArrayCharges = charges.filter(e => (e.id ? e : null));
      const results = [];
      for (const updateData of updateArrayCharges) {
        results.push(
          CaregiverCharges.query()
            .where('id', updateData.id)
            .transacting(trx)
            .update(updateData),
        );
      }
      if (results && results.length) {
        await Promise.all(results);
      }

      // create many for rest of the dataset
      const createArray = charges.filter(e => (e.id ? null : e));
      if (createArray && createArray.length) {
        await caregiver.charges().createMany(createArray, trx);
      }

      // delete charges which are removed
      if (deletedCharges && deletedCharges.length) {
        await CaregiverCharges.query()
          .whereIn('id', deletedCharges)
          .delete(trx);
      }

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service AddUpdateCharges Catch %s', error);
      throw error;
    }
  }
}

module.exports = ChargeService;
