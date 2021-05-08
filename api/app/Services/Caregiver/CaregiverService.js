// Libraries
const Database = use('Database');
const Logger = use('Logger');
const path = require('path');

const Mail = use('Mail');
const Env = use('Env');
const Moment = require('moment');
const momentRange = require('moment-range');

const moment = momentRange.extendMoment(Moment);

const util = make('App/Services/Common/UtilService');
const message = require(path.resolve('app/Constants/Response/index'));

// Models
const Caregiver = use('App/Models/Caregiver');
const CaregiverBooking = use('App/Models/CaregiverBooking');
const ClientFeedbacks = use('App/Models/ClientFeedbacks');

const constantMsg = {
  awaiting: '1',
  accepted: '2',
  rejected: '3',
  cancelled: '4',
  chinese: '1',
};

class CaregiverService {
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
   * Purpose: To get overview data for caregiver (Profile Section)
   * Params: caregiverId
   * */
  async getProfileOverview(caregiverId) {
    const caregiver = await Caregiver.query()
      .select(
        'id',
        'user_id',
        'registration_no',
        'self_introduction',
        'avg_rating',
        'caregiver_type',
      )
      .where('id', caregiverId)
      .with('user', userQuery => {
        userQuery.select('id', 'salute', 'is_deleted');
      })
      .with('languages', languageQuery => {
        languageQuery.select('id', 'caregiver_id', 'language', 'other_lang');
      })
      .withCount('feedbacks', builder => {
        builder.where('is_deleted', '0');
      })
      .first();
    return caregiver;
  }

  /**
   * Name: Jainam Shah
   * Purpose: To get profile info data for caregiver (Profile Section)
   * Params: caregiverId
   * */
  async getProfileInfo(caregiverId) {
    const caregiver = await Caregiver.query()
      .select(
        'id',
        'english_name',
        'chinese_name',
        'caregiver_type',
        'show_employer_option',
      )
      .where('id', caregiverId)
      .with('skills', skillQuery => {
        skillQuery.select('id', 'type', 'english_title');
      })
      .with('employer', employerQuery => {
        employerQuery.select(
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
      .first();
    return caregiver;
  }

  /**
   * Name: Jainam Shah
   * Purpose: To get caregivers based on user's search
   * Params: request
   * */
  async getCaregivers(reqData) {
    const recordPerPage = reqData.recordPerPage ? reqData.recordPerPage : 10;
    const pageNumber = reqData.pageNumber ? reqData.pageNumber : 1;
    const offset = (pageNumber - 1) * recordPerPage;
    const orderBy = reqData.orderBy ? reqData.orderBy : 'caregivers.id';
    const orderDir = reqData.orderDir
      ? reqData.orderDir === 'asc'
        ? 'ASC'
        : 'DESC'
      : 'DESC';

    const qb = Caregiver.query();

    qb.select(
      'caregivers.id',
      'user_id',
      'registration_no',
      'english_name',
      'chinese_name',
      'nick_name',
      'caregivers.prev_exp',
      'avg_rating',
      'show_employer_option',
      'licence_expiry_date',
    );

    // Check if caregiver_type RN/EN's licence not expired
    qb.whereRaw(
      "CASE WHEN (caregivers.caregiver_type in  ('1', '2')) THEN caregivers.licence_expiry_date >= CURRENT_DATE ELSE true END",
    );

    // for calculating total experience
    qb.leftJoin('caregiver_employers as ce', function cb() {
      this.on(
        'ce.caregiver_id',
        '=',
        'caregivers.id',
      ).onIn('ce.is_current_employer', ['1']);
    });
    qb.select(
      Database.raw(
        "CASE WHEN ce.is_current_employer = '1' THEN (caregivers.prev_exp + IFNULL(TIMESTAMPDIFF(MONTH, CONCAT(ce.from_year, '-', ce.from_month, '-', '01'), SYSDATE()),0)) ELSE caregivers.prev_exp END AS total_exp",
      ),
    );

    if (reqData.registration_no) {
      qb.where('registration_no', reqData.registration_no);
    }

    if (reqData.caregiver_type) {
      qb.where('caregiver_type', reqData.caregiver_type);
    }

    if (reqData.services && reqData.services.length) {
      qb.whereHas(
        'skills',
        skillsBuilder => {
          skillsBuilder.whereIn('skillset_id', reqData.services);
        },
        '=',
        reqData.services.length,
      );
    }

    if (reqData.location_id) {
      qb.whereHas('locations', locationBuilder => {
        locationBuilder.where('location_id', reqData.location_id);
      });
    }

    // calculating price per hour based on user's search criteria

    let hours = 1;
    if (reqData.from_time && reqData.to_time) {
      const startTime = reqData.from_time.split(':');
      const endTime = reqData.to_time.split(':');

      let startTimeMoment;
      if (reqData.to_time == '23:59') {
        startTimeMoment = moment(
          [startTime[0], startTime[1]],
          'HH:mm',
        ).subtract('1', 'minute');
      } else {
        startTimeMoment = moment([startTime[0], startTime[1]], 'HH:mm');
      }

      const endTimeMoment = moment([endTime[0], endTime[1]], 'HH:mm');

      hours = endTimeMoment.diff(startTimeMoment, 'hours');
      hours = hours >= 12 ? 12 : hours;

      qb.with('charges', chargeQuery => {
        chargeQuery
          .select('id', 'caregiver_id', 'hour', 'price')
          .whereIn('hour', [1, hours]);
      });
    } else {
      qb.with('charges', chargeQuery => {
        chargeQuery
          .select('id', 'caregiver_id', 'hour', 'price')
          .where('hour', hours);
      });
    }

    if (reqData.date && !reqData.from_time && !reqData.to_time) {
      const day = moment(reqData.date).day();
      qb.whereHas('availability', availabilityBuilder => {
        availabilityBuilder.whereRaw(
          '? >= (CAST(from_day AS UNSIGNED)-1) AND ? <= (CAST(to_day AS UNSIGNED)-1)',
          [day, day],
        );
      });
    }

    if (!reqData.date && reqData.from_time && reqData.to_time) {
      qb.whereHas('availability', availabilityBuilder => {
        availabilityBuilder.whereRaw(
          'CAST(? AS TIME) >= CAST(from_time AS TIME) AND CAST(? AS TIME) <= CAST(to_time AS TIME)',
          [reqData.from_time, reqData.to_time],
        );
      });
    }

    // Nirav
    if (reqData.date && reqData.from_time && reqData.to_time) {
      const day = moment(reqData.date).day();
      qb.whereHas('availability', availabilityBuilder => {
        availabilityBuilder.whereRaw(
          '? >= (CAST(from_day AS UNSIGNED)-1) AND ? <= (CAST(to_day AS UNSIGNED)-1) AND CAST(? AS TIME) >= CAST(from_time AS TIME) AND CAST(? AS TIME) <= CAST(to_time AS TIME)',
          [day, day, reqData.from_time, reqData.to_time],
        );
      });

      const fmt = 'YYYY-MM-DD HH:mm:ss';
      const dateOnly = moment(reqData.date)
        .format('YYYY-MM-DD')
        .toString();
      const startInput = `${reqData.date} ${reqData.from_time}`;
      const startTime = moment(startInput).format(fmt);
      const endInput = `${reqData.date} ${reqData.to_time}`;
      const endTime = moment(endInput).format(fmt);

      let bookedCaregiver = await this.getBookedCaregivers(
        dateOnly,
        startTime,
        endTime,
      );

      bookedCaregiver = bookedCaregiver.toJSON();
      let bookedCaregiverIds = bookedCaregiver.map(
        e =>
          e.caregiverDetail &&
          e.caregiverDetail[0] &&
          e.caregiverDetail[0].caregiver_id,
      );
      bookedCaregiverIds = bookedCaregiverIds.filter(Boolean);
      bookedCaregiverIds = [...new Set(bookedCaregiverIds)];
      if (bookedCaregiverIds && bookedCaregiverIds.length) {
        qb.whereNotIn('caregivers.id', bookedCaregiverIds);
      }
    }

    if (reqData.min_exp) {
      qb.whereHas('employer', employerBuilder => {
        employerBuilder.whereRaw(
          `CASE WHEN is_current_employer = '1' THEN ${reqData.min_exp *
            12} <= (caregivers.prev_exp + IFNULL(TIMESTAMPDIFF(MONTH, CONCAT(caregiver_employers.from_year, '-', caregiver_employers.from_month, '-', '01'), SYSDATE()),0)) ELSE ${reqData.min_exp *
            12} <= caregivers.prev_exp END`,
        );
      });
    }

    // Relations
    qb.with('user', userQuery => {
      userQuery.select('id', 'salute');
    });
    qb.with('employer', employerQuery => {
      employerQuery.select(
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
    });
    qb.with('education', educationQuery => {
      educationQuery.select(
        'id',
        'caregiver_id',
        'institute_name',
        'degree',
        'start_year',
        'end_year',
      );
    });
    qb.withCount('feedbacks', builder => {
      builder.where('is_deleted', '0');
    });

    // Conditions
    qb.whereHas('user', userBuilder => {
      userBuilder
        .where('user_type', '2')
        .where('status', '1')
        .where('is_deleted', '0');
    });
    qb.whereNull('current_step');
    qb.where('caregivers.status', '2');

    if (orderBy == 'price') {
      // order by price
      const sortingHours = reqData.durationSort == 'false' ? 1 : hours;
      qb.leftJoin(
        'caregiver_charges as cc',
        'cc.caregiver_id',
        'caregivers.id',
      ).where('cc.hour', sortingHours);
      qb.orderBy('cc.price', orderDir);
    } else if (orderBy == 'feedback') {
      // order by feedback / rating
      qb.orderBy('avg_rating', orderDir);
      qb.orderBy('feedbacks_count', orderDir);
    } else if (orderBy == 'experience') {
      // order by experience
      // use this if total_exp has any issue -> qb.orderBy('prev_exp', orderDir);
      qb.orderBy('total_exp', orderDir);
    } else {
      qb.orderBy(orderBy, orderDir);
    }

    const count = await qb.getCount();

    // Pagination
    qb.limit(recordPerPage);
    qb.offset(offset);

    const caregivers = await qb.fetch();

    return { caregivers, count, recordPerPage, pageNumber };
  }

  async getBookedCaregivers(dateOnly, startTime, endTime) {
    const caregiverBookingQB = CaregiverBooking.query();
    caregiverBookingQB.select('id', 'date', 'start_time', 'end_time', 'status');
    caregiverBookingQB.whereRaw(`CAST(date AS DATE) = '${dateOnly}'`);
    caregiverBookingQB.whereRaw(
      Database.raw(
        `(
          (
            (
              CAST('${startTime}' as datetime) >= start_time AND
              CAST('${startTime}' as datetime) < end_time
            )
          )
        OR
          (
            (
              CAST('${endTime}' as datetime) > start_time AND
              CAST('${endTime}' as datetime) <= end_time
            )
          )
        OR 
          (
            ( 
                start_time >= CAST('${startTime}' as datetime) AND 
                start_time  <  CAST('${endTime}' as datetime) 
            )
          )
        OR
          (
            ( 
              end_time > CAST('${startTime}' as datetime) AND 
              end_time  <=  CAST('${endTime}' as datetime) 
            )
          )
        )`,
      ),
    );
    caregiverBookingQB.with('caregiverDetail', caregiverDetailQuery => {
      caregiverDetailQuery.select(
        'id',
        'caregiver_booking_id',
        'caregiver_id',
        'status',
      );
      caregiverDetailQuery.where('status', constantMsg.accepted);
    });
    // caregiverBookingQB.where('status', '2');
    // If booking status is awaiting_for_response=1 or confirmed=2 by Admin
    caregiverBookingQB.whereIn('status', ['1', '2']);
    const bookingQBData = await caregiverBookingQB.fetch();
    return bookingQBData;
  }

  async getAllFeedbacks(reqData, caregiver) {
    try {
      const recordPerPage = reqData.recordPerPage ? reqData.recordPerPage : 10;
      const pageNumber = reqData.pageNumber ? reqData.pageNumber : 1;
      const offset = (pageNumber - 1) * recordPerPage;
      const orderBy = reqData.orderBy ? reqData.orderBy : 'created_at';
      const orderDir = reqData.orderDir
        ? reqData.orderDir === 'asc'
          ? 'ASC'
          : 'DESC'
        : 'DESC';

      const qb = ClientFeedbacks.query();

      qb.select(
        'id',
        'client_id',
        'rating',
        'positive_feedback',
        'negative_feedback',
        'created_at',
      );

      qb.with('client', clientQuery => {
        clientQuery.select('id', 'user_id', 'first_name', 'last_name');
      });

      qb.where('caregiver_id', caregiver.id);

      qb.where('is_deleted', '=', 0);

      qb.orderBy(orderBy, orderDir);

      const count = await qb.getCount();

      // Pagination
      qb.limit(recordPerPage);
      qb.offset(offset);

      const clientfeedback = await qb.fetch();

      return { clientfeedback, count, recordPerPage, pageNumber };
    } catch (error) {
      Logger.info('getAllfeedback Catch %s', error);
      throw error;
    }
  }

  async getAllCaregivers(reqData) {
    try {
      const recordPerPage = reqData.recordPerPage ? reqData.recordPerPage : 10;
      const pageNumber = reqData.pageNumber ? reqData.pageNumber : 1;
      const offset = (pageNumber - 1) * recordPerPage;
      const orderBy = reqData.orderBy ? reqData.orderBy : 'created_at';
      const orderDir = reqData.orderDir
        ? reqData.orderDir === 'asc'
          ? 'ASC'
          : 'DESC'
        : 'DESC';

      const qb = Caregiver.query();

      qb.select(
        'caregivers.id',
        'user_id',
        'registration_no',
        'english_name',
        'chinese_name',
        'caregivers.status',
        'nick_name',
        'caregiver_type',
        'licence_expiry_date',
        'caregivers.created_at',
      );

      if (reqData.status) {
        qb.where('status', reqData.status);
      }

      if (
        reqData.expiredWithinMonth == 'true' &&
        (reqData.caregiver_type == '1' || reqData.caregiver_type == '2')
      ) {
        qb.whereRaw(
          'licence_expiry_date > CURRENT_DATE AND licence_expiry_date < DATE_ADD(CURRENT_DATE,INTERVAL 1 MONTH)',
        );
      }

      if (reqData.registration_no) {
        qb.where('registration_no', reqData.registration_no);
      }

      if (reqData.caregiver_type) {
        qb.where('caregiver_type', reqData.caregiver_type);
      }

      // Relations
      qb.with('user', userQuery => {
        userQuery.select(
          'id',
          'mobile_number',
          'email',
          'due_amount',
          'is_deleted',
        );
      });

      qb.whereHas('user', userBuilder => {
        userBuilder.where('is_deleted', '=', 0);
      });

      if (reqData.isRefferalFeeDue == 'true') {
        qb.whereHas('user', userBuilder => {
          userBuilder.where('due_amount', '>', 0);
        });
      }

      if (reqData.mobile_number) {
        qb.whereHas('user', userBuilder => {
          userBuilder.where('mobile_number', reqData.mobile_number);
        });
      }

      if (reqData.email) {
        qb.whereHas('user', userBuilder => {
          userBuilder.where('email', reqData.email);
        });
      }

      if (orderBy == 'due_amount') {
        qb.leftJoin('users as usr', 'usr.id', 'caregivers.user_id');
        qb.orderBy('usr.due_amount', orderDir);
      } else {
        qb.orderBy(orderBy, orderDir);
      }
      if (reqData.requiredCSV) {
        const caregivers = await qb.fetch();

        return caregivers;
      }
      const count = await qb.getCount();

      // Pagination
      qb.limit(recordPerPage);
      qb.offset(offset);

      const caregivers = await qb.fetch();

      return { caregivers, count, recordPerPage, pageNumber };
      // }
    } catch (error) {
      Logger.info(' getAllcaregivers Catch %s', error);
      throw error;
    }
  }

  async changeStatus(caregiver) {
    try {
      const updateCaregiverStatus = caregiver.filter(e => (e.id ? e : null));
      for (const updateData of updateCaregiverStatus) {
        let caregiverData = await Caregiver.query()
          .with('user')
          .where('id', updateData.id)
          .first();
        caregiverData = caregiverData.toJSON();
        if (caregiverData) {
          if (
            updateData.status == message.caregiverStatusType.approved &&
            caregiverData.current_step !== null
          ) {
            const resData = {
              success: false,
              message: `Onboarding Steps not completed for Caregiver with email:${caregiverData.user.email}(${caregiverData.registration_no}).`,
            };
            throw resData;
          } else if (
            updateData.status == message.caregiverStatusType.approved &&
            caregiverData.status == message.caregiverStatusType.approved
          ) {
            const resData = {
              success: false,
              message: `${caregiverData.user.email}'s profile has been approved already.`,
            };
            throw resData;
          } else if (
            updateData.status == message.caregiverStatusType.unapproved &&
            caregiverData.status == message.caregiverStatusType.unapproved
          ) {
            const resData = {
              success: false,
              message: `${caregiverData.user.email}'s profile has been unapproved already.`,
            };
            throw resData;
          }
          await Caregiver.query()
            .where('id', updateData.id)
            .update(updateData);
          if (updateData.status == message.caregiverStatusType.approved) {
            util.sendWhatsAppMessage(
              caregiverData.user.mobile_number,
              `恭喜！你的帳戶現已增加到Pure Care平台；客戶現在可以找尋你作護理工作！
              \n聯絡Pure Care?\n電話/Whatsapp: 6364 0301\n電郵: info@purecare.com.hk\n職業介紹所牌照號碼: 61164`,
            ),
              Mail.send(
                caregiverData.user.preferred_communication_language ===
                  constantMsg.chinese
                  ? 'email.ch.profile-approved-caregiver'
                  : 'email.en.profile-approved-caregiver',
                {},
                mail => {
                  mail
                    .to(caregiverData.user.email)
                    .from(Env.get('EMAIL_FROM'))
                    .subject(
                      caregiverData.user.preferred_communication_language ===
                        constantMsg.chinese
                        ? '個人資料已獲批准'
                        : 'Profile approved',
                    );
                },
              );
          }
        }
      }
    } catch (error) {
      Logger.info(' changeStatus Catch %s', error);
      throw error;
    }
  }
}

module.exports = CaregiverService;
