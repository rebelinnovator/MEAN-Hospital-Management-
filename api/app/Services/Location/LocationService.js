// Models
const Location = use('App/Models/Location');

class LocationService {
  /**
   * Name: Jainam Shah
   * Purpose: To get all locations from the system
   * Params: N/A
   * */
  async getLocations() {
    const locations = await Location.query()
      .select('id', 'name')
      .with('subLocations', query => {
        query.select('id', 'name', 'parent_id');
      })
      .whereNull('parent_id')
      .fetch();
    return locations;
  }
}
module.exports = LocationService;
