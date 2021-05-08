// Libraries
const Logger = use('Logger');
const database = use('Database');

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

// Models
const Caregiver = use('App/Models/Caregiver');
const CaregiverAvailability = use('App/Models/CaregiverAvailability');

class AvailabilityService {
  /**
   * Name: Jainam Shah
   * Purpose: To check if caregiver is exists or not
   * Params: registration_no
   * */
  async checkCaregiver(registrationNo) {
    const caregiver = await Caregiver.findBy('registration_no', registrationNo);
    return caregiver;
  }

  /**
   * Name: Jainam Shah
   * Purpose: To get availability and locations for a caregiver
   * Params: caregiver_id
   * */
  async getAvailability(caregiverId) {
    const availability = await Caregiver.query()
      .select('id', 'english_name', 'chinese_name')
      .where('id', caregiverId)
      .with('availability', availabilityQuery => {
        availabilityQuery.select(
          'id',
          'caregiver_id',
          'from_day',
          'to_day',
          'from_time',
          'to_time',
        );
      })
      .with('locations', locationQuery => {
        locationQuery.select('id', 'parent_id', 'name');
      })
      .first();
    return availability;
  }

  /**
   * Name: Jainam Shah
   * Purpose: To check if availability conflicting hours or not
   * Params: from_day, to_day, from_time, to_time
   * */
  async checkConflictAvailability(e, day, days) {
    let resDataObj = {
      success: true,
      message: null,
    };
    for (let i = e.from_day; i <= e.to_day; i++) {
      const fromDayDb = moment(`${days[i].date} ${e.from_time}`);
      const toDayDb = moment(`${days[i].date} ${e.to_time}`);
      const range1 = moment.range(fromDayDb, toDayDb);

      for (let j = day.from_day; j <= day.to_day; j++) {
        const fromDayUser = moment(`${days[j].date} ${day.from_time}`);
        const toDayUser = moment(`${days[j].date} ${day.to_time}`);
        const range2 = moment.range(fromDayUser, toDayUser);

        if (range1.overlaps(range2)) {
          resDataObj = {
            success: false,
            message: `Conflicting availability for ${days[e.from_day].day} to ${
              days[e.to_day].day
            } hours`,
          };
        }
      }
    }
    return resDataObj;
  }

  /**
   * Name: Jainam Shah
   * Purpose: check availability of a caregiver (one or more)
   * Params: availability data
   * */
  async checkAvailability(data) {
    const days = [
      { day: 'Sunday', date: '1999-01-03' },
      { day: 'Monday', date: '1999-01-04' },
      { day: 'Tuesday', date: '1999-01-05' },
      { day: 'Wednesday', date: '1999-01-06' },
      { day: 'Thursday', date: '1999-01-07' },
      { day: 'Friday', date: '1999-01-08' },
      { day: 'Saturday', date: '1999-01-09' },
    ];
    const resData = [];

    for (const [index, e] of data.entries()) {
      e.from_day = Number(e.from_day);
      e.to_day = Number(e.to_day);

      // let checkDay = await CaregiverAvailability.query()
      // .where('caregiver_id', e.caregiver_id).andWhere('from_day', e.from_day)
      // .fetch().toJSON();

      const checkDay = data.filter((cd, i) => {
        cd.from_day = Number(cd.from_day);
        cd.to_day = Number(cd.to_day);
        return i !== index;
      });

      if (checkDay.length) {
        const results = [];
        for (const day of checkDay) {
          results.push(this.checkConflictAvailability(e, day, days));
        }
        const resDataObj = await Promise.all(results);
        resData.push(...resDataObj);
      } else {
        resData.push({
          success: true,
          message: null,
        });
      }
    }
    return resData;
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update/delete availability of a caregiver (one or more)
   * Params: caregiver, reqData
   * */
  async modifyAvailabilityLocations(caregiver, reqData) {
    const trx = await database.beginTransaction();
    try {
      if (caregiver.current_step === '4') {
        caregiver.current_step = '5';
        await caregiver.save(trx);
      }

      if (reqData.availability && reqData.availability.length) {
        await this.modifyAvailability(
          caregiver,
          reqData.availability,
          reqData.deleted_availability,
          trx,
        );
      }

      if (reqData.locations && reqData.locations.length) {
        await this.modifyLocations(caregiver, reqData.locations, trx);
      }
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service modifyAvailabilityLocations Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update/delete availability of a caregiver (one or more)
   * Params: caregiver, availability data, deleted availability_data
   * */
  async modifyAvailability(caregiver, data, deletedAvailability, trx) {
    // update data which has id
    const updateArray = data.filter(e => {
      e.from_day = e.from_day.toString();
      e.to_day = e.to_day.toString();
      return e.id ? e : null;
    });
    const results = [];
    for (const updateData of updateArray) {
      results.push(
        CaregiverAvailability.query()
          .where('id', updateData.id)
          .transacting(trx)
          .update(updateData),
      );
    }
    await Promise.all(results);

    const createArray = data.filter(e => {
      e.from_day = e.from_day.toString();
      e.to_day = e.to_day.toString();
      return e.id ? null : e;
    });
    // create many for rest of the dataset
    await caregiver.availability().createMany(createArray, trx);

    // delete availability which caregiver removed
    await CaregiverAvailability.query()
      .whereIn('id', deletedAvailability)
      .delete(trx);
  }

  /**
   * Name: Jainam Shah
   * Purpose: add/update locations of a caregiver (one or more)
   * Params: location data
   * */
  async modifyLocations(caregiver, data, trx) {
    await caregiver.locations().sync(data, null, trx);
  }
}

module.exports = AvailabilityService;
