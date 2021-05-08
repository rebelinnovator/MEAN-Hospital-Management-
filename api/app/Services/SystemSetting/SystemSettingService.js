const SystemSetting = use('App/Models/SystemSetting');

class SystemSettingService {
  /**
   * Name: Jainam Shah
   * Purpose: To check if setting field is exists or not
   * Params: id
   * */
  async checkSettings(title) {
    const setting = await SystemSetting.findBy('title', title);
    return setting;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: Get Settings
   * Params: where
   * */
  async getSystemSettings(where = null) {
    const qb = SystemSetting.query();
    if (where) {
      qb.where(where);
    }
    qb.select('id', 'title', 'value');
    const systemSetting = qb.fetch();
    return systemSetting;
  }

  /**
   * Name: Jainam Shah
   * Purpose: Update Settings
   * Params: settingsData, reqData
   * */
  async updateSystemSettings(reqData) {
    const data = [
      { id: 1, title: 'caregiver_service_fee' },
      { id: 2, title: 'client_service_fee' },
      { id: 3, title: 'caregiver_referral' },
      { id: 4, title: 'sort_by_exp' },
      { id: 5, title: 'sort_by_rating' },
    ];

    reqData.settings.map(e => {
      const record = data.find(d => d.title === e.title);
      record.value = e.value;
    });

    for (const d of data) {
      const record = await SystemSetting.find(d.id);
      record.value = d.value;
      await record.save();
    }
  }
}

module.exports = SystemSettingService;
