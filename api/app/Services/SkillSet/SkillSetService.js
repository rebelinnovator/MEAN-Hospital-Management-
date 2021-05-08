// Models
const SkillSet = use('App/Models/Skillset');

class SkillSetService {
  /**
   * Name: Jainam Shah
   * Purpose: To get all SkillSet from the system
   * Params: query
   * */
  async getSkillSet(q) {
    q.caregiver_type = q.caregiver_type === 2 ? 1 : q.caregiver_type;
    const skillSet = await SkillSet.query()
      .select(
        'id',
        'caregiver_type',
        'english_title',
        'type',
        'en_explanation',
        'ch_explanation',
      )
      .where('caregiver_type', q.caregiver_type)
      .fetch();
    return skillSet;
  }
}
module.exports = SkillSetService;
