// Models
const SelfCareAbility = use('App/Models/SelfcareAbility');

class SelfCareAbilityService {
  /**
   * Name: Jainam Shah
   * Purpose: To get all self care abilities from the system
   * Params: N/A
   * */
  async getSelfCareAbilities() {
    const abilities = await SelfCareAbility.query()
      .select('id', 'name')
      .with('subAbilities', query => {
        query.select('id', 'name', 'parent_id');
      })
      .whereNull('parent_id')
      .fetch();
    return abilities;
  }
}
module.exports = SelfCareAbilityService;
