// Models
const Illness = use('App/Models/Illness');

class IllnessService {
  /**
   * Name: Nirav Goswami
   * Purpose: To get all illnesses from the system
   * Params: N/A
   * */
  async getIllnesses() {
    const illnesses = await Illness.query()
      .select('id', 'english_title', 'is_specific')
      .with('children', query => {
        query.select('id', 'english_title', 'parent_id', 'is_specific');
      })
      .whereNull('parent_id')
      .fetch();
    return illnesses;
  }
}
module.exports = IllnessService;
