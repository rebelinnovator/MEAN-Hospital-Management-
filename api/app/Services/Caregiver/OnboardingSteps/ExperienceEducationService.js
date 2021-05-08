const Logger = use('Logger');
const _ = require('lodash');

const database = use('Database');
const Caregiver = use('App/Models/Caregiver');
const CaregiverEmployer = use('App/Models/CaregiverEmployer');
const CaregiverEducation = use('App/Models/CaregiverEducation');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

class ExperienceEducationService {
  async addUpdateExperienceEducation(caregiver, reqData) {
    const trx = await database.beginTransaction();
    try {
      caregiver.licence_expiry_date =
        reqData.caregiver_type == '1' || reqData.caregiver_type == '2'
          ? new Date(reqData.licence_expiry_date)
          : null;
      caregiver.show_employer_option = reqData.show_employer_option;
      if (caregiver.current_step === '2') {
        caregiver.current_step = '3';
      }
      await caregiver.save();
      // Modify Employer Data
      await this.modifyEmployer(
        caregiver,
        reqData.employer,
        reqData.deleted_employer,
        trx,
      );
      // Modify Education Data
      await this.modifyEducation(
        caregiver,
        reqData.education,
        reqData.deleted_education,
        trx,
      );

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service AddUpdateExperienceEducation Catch %s', error);
      throw error;
    }
  }

  async modifyEmployer(caregiver, employer, deletedEmployer, trx) {
    if (employer && employer.length) {
      // update data which has id
      const updateArrayEmployer = employer.filter(e => (e.id ? e : null));
      const results = [];
      for (const updateData of updateArrayEmployer) {
        results.push(
          CaregiverEmployer.query()
            .where('id', updateData.id)
            .transacting(trx)
            .update(updateData),
        );
      }
      if (results && results.length) {
        await Promise.all(results);
      }

      // create many for rest of the dataset
      const createArray = employer.filter(e => (e.id ? null : e));
      if (createArray && createArray.length) {
        await caregiver.employer().createMany(createArray, trx);
      }
    }

    // delete employer which caregiver removed
    if (deletedEmployer && deletedEmployer.length) {
      await CaregiverEmployer.query()
        .whereIn('id', deletedEmployer)
        .delete(trx);
    }

    const prevExp = await this.calcPrevExperince(employer);
    caregiver.prev_exp = prevExp;
    await caregiver.save(trx);
  }

  async calcPrevExperince(employer) {
    const empData = JSON.parse(JSON.stringify(employer));
    const prevEmp = empData.filter((i, idx) => {
      i.tempIdx = idx;
      if (i.from_month && i.from_year) {
        i.from_date = moment()
          .year(i.from_year)
          .month(i.from_month - 1)
          .date(1);
      }
      if (i.to_month && i.to_year) {
        i.to_date = moment()
          .year(i.to_year)
          .month(i.to_month - 1)
          .date(1);
      }
      if (i.from_date && i.to_date) {
        i.range = moment.range(i.from_date, i.to_date);
      }
      return i.is_current_employer !== '1';
    });
    const sortedPrevEmp = prevEmp.sort(this.sortDateFn);
    const groupeddata = this.groupByOverlap(sortedPrevEmp);
    const prevExp = this.calcDuration(groupeddata);
    return prevExp;
  }

  sortDateFn(previous, current) {
    const previousTime = previous.from_date
      ? previous.from_date.valueOf()
      : previous.valueOf();
    const currentTime = current.from_date
      ? current.from_date.valueOf()
      : current.valueOf();
    if (previousTime < currentTime) {
      return -1;
    }
    if (previousTime === currentTime) {
      return 0;
    }
    return 1;
  }

  groupByOverlap(prevEmp) {
    const groupedData = [];
    while (prevEmp.length) {
      const checkData = prevEmp.slice(1, prevEmp.length);
      const curr = prevEmp[0];
      const group = [curr];
      _.remove(prevEmp, item => curr.tempIdx === item.tempIdx);
      checkData.forEach(item => {
        if (curr.range.overlaps(item.range)) {
          _.remove(prevEmp, fItem => item.tempIdx === fItem.tempIdx);
          group.push(item);
        }
      });
      groupedData.push(group);
    }
    return groupedData;
  }

  calcDuration(groupedData) {
    const duration = groupedData.reduce((prev, curr) => {
      let dur = 0;
      if (curr.length > 1) {
        const fromDate = curr.map(i => i.from_date).sort(this.sortDateFn)[0];
        const toDate = curr
          .map(i => i.to_date)
          .sort(this.sortDateFn)
          .slice(-1)[0];
        dur = toDate.diff(fromDate, 'month');
      } else {
        curr = curr[0];
        // console.log(
        //   'calcDuration --T1--',
        //   curr.from_date.format(),
        //   curr.to_date.format(),
        // );
        dur = curr.to_date.diff(curr.from_date, 'month');
      }
      return dur + prev;
    }, 0);
    return duration;
  }

  async modifyEducation(caregiver, education, deletedEducation, trx) {
    if (education && education.length) {
      // update data which has id
      const updateArrayEducation = education.filter(e => (e.id ? e : null));
      const results = [];
      for (const updateData of updateArrayEducation) {
        results.push(
          CaregiverEducation.query()
            .where('id', updateData.id)
            .transacting(trx)
            .update(updateData),
        );
      }
      if (results && results.length) {
        await Promise.all(results);
      }

      // create many for rest of the dataset
      const createArray = education.filter(e => (e.id ? null : e));
      if (createArray && createArray.length) {
        await caregiver.education().createMany(createArray, trx);
      }
    }

    // delete education which caregiver removed
    if (deletedEducation && deletedEducation.length) {
      await CaregiverEducation.query()
        .whereIn('id', deletedEducation)
        .delete(trx);
    }
  }

  async getExperienceEducation(caregiverId) {
    try {
      const caregiver = await Caregiver.query()
        .where('id', caregiverId)
        .select('id', 'licence_expiry_date', 'show_employer_option')
        .with('employer', query1 => {
          query1.select(
            'id',
            'caregiver_id',
            'name',
            'work_type',
            'from_month',
            'from_year',
            'to_month',
            'to_year',
            'is_current_employer',
          );
        })
        .with('education', query2 => {
          query2.select(
            'id',
            'caregiver_id',
            'institute_name',
            'degree',
            'start_year',
            'end_year',
          );
        })
        .fetch();
      return caregiver;
    } catch (error) {
      Logger.info('Service getExperienceEducation Catch %s', error);
      throw error;
    }
  }
}

module.exports = ExperienceEducationService;
