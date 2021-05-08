const Logger = use('Logger');
const database = use('Database');
const Caregiver = use('App/Models/Caregiver');

class SkillSetService {
  async getCaregiverSkillSet(caregiverId) {
    try {
      const caregiver = await Caregiver.query()
        .where('id', caregiverId)
        .select('id', 'self_introduction')
        .with('skills', query => {
          query.select('id', 'caregiver_type', 'type', 'english_title');
        })
        .fetch();
      return caregiver;
    } catch (error) {
      Logger.info(' ServicegetCaregiverSkillSet Catch %s', error);
      throw error;
    }
  }

  async addUpdateCaregiverSkillSet(caregiver, reqData) {
    const trx = await database.beginTransaction();
    try {
      caregiver.self_introduction = reqData.self_introduction;
      if (caregiver.current_step === '3') {
        caregiver.current_step = '4';
      }
      await caregiver.save(trx);
      if (reqData.skills && reqData.skills.length) {
        await caregiver.skills().sync(reqData.skills, null, trx);
      }
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service AddUpdateExperienceEducation Catch %s', error);
      throw error;
    }
  }
}
module.exports = SkillSetService;
