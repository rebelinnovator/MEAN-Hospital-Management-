// Libraries
const Logger = use('Logger');
const database = use('Database');
const Mail = use('Mail');
const Env = use('Env');
const path = require('path');
const CryptoJS = require('crypto-js');

const _ = use('lodash');

const message = require(path.resolve('app/Constants/Response/index'));
const moment = require('moment');
const randtoken = require('rand-token');

// Services
const util = make('App/Services/Common/UtilService');

// Models
const Booking = use('App/Models/CaregiverBooking');
const User = use('App/Models/User');
const Skillset = use('App/Models/Skillset');
const Client = use('App/Models/Client');
const Caregiver = use('App/Models/Caregiver');

const constantMsgs = {
  awaiting: '1',
  accepted: '2',
  rejected: '3',
  cancelled: '4',
  isCancelled: '1',
  chinese: '1',
  english: '2',
};

class BookingService {
  /**
   * Name: Jainam Shah
   * Purpose: get caregiver details from registration number
   * Params: registration_no
   * */
  async getCaregiver(regNo) {
    const caregiver = await Caregiver.query()
      .with('user')
      .where('registration_no', regNo)
      .first();
    return caregiver;
  }

  /**
   * Name: Nirav Goswami
   * Purpose:get active booking(which is not paid or not confirmed by any caregiver) counts
   * Params: clinetId
   * */
  async getActiveBooking(clinetId) {
    const qb = Booking.query();
    qb.where('client_id', clinetId);
    qb.where(builder => {
      builder
        .where('status', constantMsgs.awaiting) // awaiting_for_response
        .andWhere('payment_status', '1') // Unpaid
        .whereNull('cancelled_by');
    });
    const count = await qb.getCount();
    return count;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: add Booking
   * Params: reqData
   * */
  async addBooking(reqData) {
    const trx = await database.beginTransaction();
    try {
      // reqData.date = new Date();
      reqData.date = reqData.start_time;
      reqData.booking_id = await this.generateDistinctBookingID();
      const booking = new Booking();
      booking.date = reqData.date;
      booking.client_id = reqData.client_id;
      booking.start_time = reqData.start_time;
      booking.end_time = reqData.end_time;
      booking.duration = reqData.duration;
      booking.booking_id = reqData.booking_id;
      if (reqData.transport_subsidy) {
        booking.transport_subsidy = reqData.transport_subsidy;
      }

      await booking.save(trx);

      if (reqData.services && reqData.services.length) {
        await booking.services().sync(reqData.services, null, trx);
      }
      if (reqData.caregiver && reqData.caregiver.length) {
        await booking.caregiverDetail().createMany(reqData.caregiver, trx);
      }

      let client = await Client.query()
        .where('id', reqData.client_id)
        .with('user', userQuery => {
          userQuery.select(
            'id',
            'email',
            'mobile_number',
            'preferred_communication_language',
          );
        })
        .with('languages', languagesQuery => {
          languagesQuery.select('id', 'client_id', 'language', 'other_lang');
        })
        .with('illness', query => {
          query
            .select('id', 'english_title', 'is_specific')
            .withPivot('specific_title');
        })
        .with('otherDevices', otherDevicesQuery => {
          otherDevicesQuery.select(
            'id',
            'client_id',
            'other_device',
            'specific_drug',
          );
        })
        .with('selfCareAbilities', selfCareAbilitiesQuery => {
          selfCareAbilitiesQuery
            .select('id', 'name', 'parent_id')
            .with('parent', query => {
              query.select('id', 'name');
            });
        })
        .first();
      client = client.toJSON();

      await this.sendMailToClient(client, reqData);
      const caregiverIds = reqData.caregiver.map(c => c.caregiver_id);

      await this.sendMailToCaregiver(client, caregiverIds, reqData);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service addBooking Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Nirav Goswami
   * Purpose:Send booking requeset received mail to client
   * Params: client, bookking
   * */
  async sendMailToClient(client, booking) {
    if (client) {
      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      let mailData = {
        email: client.user.email,
        accountUserName: `${client.first_name} ${client.last_name}`,
        serviceUserName: `${client.service_user_firstname} ${client.service_user_lastname}`,
        bookingDate: `${date} between ${startTime} and ${endTime}`,
      };
      if (
        client.user.preferred_communication_language === constantMsgs.chinese
      ) {
        mailData = {
          email: client.user.email,
          accountUserName: `${client.first_name} ${client.last_name}`,
          serviceUserName: `${client.service_user_firstname} ${client.service_user_lastname}`,
          bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime}`,
        };
      }
      await Mail.send(
        client.user.preferred_communication_language === constantMsgs.chinese
          ? 'email.ch.booking-received-client'
          : 'email.en.booking-received-client',
        mailData,
        mail => {
          mail
            .to(mailData.email)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '等待護理員確認 (第1/3步)'
                : 'Await confirmation (Step 1/3)',
            );
        },
      );
      // sending whatsapp message to Client for new requested service
      util.sendWhatsAppMessage(
        client.user.mobile_number,
        '多謝你透過Pure Care預約護理員! \n\n我們已聯絡相關護理員。當護理員答覆我們會立即跟你確認。\n\n聯絡Pure Care?\n電話/Whatsapp: 6364 0301\n電郵: info@purecare.com.hk',
      );
    }
  }

  /**
   * Name: Nirav Goswami
   * Purpose:Send booking requeset received mail to caregiver
   * Params: client, caregiverIds, bookking
   * */
  async sendMailToCaregiver(client, caregiverIds, booking) {
    let caregiver = await Caregiver.query()
      .select(
        'id',
        'user_id',
        'registration_no',
        'english_name',
        'chinese_name',
        'nick_name',
      )
      .whereIn('id', caregiverIds)
      .with('user', userQuery => {
        userQuery.select(
          'id',
          'email',
          'mobile_number',
          'preferred_communication_language',
        );
      })
      .fetch();
    let services = await Skillset.query()
      .select('id', '	english_title')
      .whereIn('id', booking.services)
      .fetch();
    services = services.toJSON();

    if (caregiver) {
      caregiver = caregiver.toJSON();
      const results = [];
      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      // const acceptLink = `${Env.get('BOOKING_ACCEPT_BY_CG_LINK')}?booking_id=${
      //   booking.booking_id
      //   }`;
      // const rejectLink = `${Env.get('BOOKING_REJECT_BY_CG_LINK')}?booking_id=${
      //   booking.booking_id
      //   }`;
      const duration = booking.duration;
      for (const c of caregiver) {
        const caregiverDetails = booking.caregiver.find(
          el => el.caregiver_id === c.id,
        );
        let mailData = {
          email: c.user.email,
          caregiverName: `${c.nick_name}`,
          accountUserName: `${client.first_name} ${client.last_name}`,
          serviceUserName: `${client.service_user_firstname} ${client.service_user_lastname}`,
          dob: moment(client.service_user_dob).format('YYYY-MM-DD'),
          weight: client.service_user_weight,
          height: client.service_user_height,
          physical_ability: client.service_user_physical_ability,
          left_hand: client.service_user_left_hand_mobility,
          right_hand: client.service_user_right_hand_mobility,
          right_leg: client.service_user_lower_right_leg_limb_mobility,
          left_leg: client.service_user_lower_left_leg_limb_mobility,
          user_caregiver_charges: caregiverDetails.caregiver_charges,
          user_caregiver_service_fee: caregiverDetails.caregiver_service_fee
            ? caregiverDetails.caregiver_service_fee.toString()
            : '0',
          subsidy: booking.transport_subsidy ? booking.transport_subsidy : '0',
          total_amount:
            caregiverDetails.caregiver_charges -
            (caregiverDetails.caregiver_service_fee
              ? caregiverDetails.caregiver_service_fee
              : 0) +
            (booking.transport_subsidy ? booking.transport_subsidy : 0),
          // acceptLink,
          // rejectLink,
        };
        const tokenData = {
          booking_id: booking.booking_id,
          registration_no: c.registration_no,
        };
        let encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(tokenData),
          `${Env.get('APP_KEY', 'D6B13YMGZ8zLKWZb51yh9hC2lXIWZtx8')}`,
        ).toString();
        encryptedData = CryptoJS.enc.Base64.parse(encryptedData);
        encryptedData = encryptedData.toString(CryptoJS.enc.Hex);
        mailData.acceptLink = `${Env.get(
          'BOOKING_ACCEPT_BY_CG_LINK',
        )}?booking_id=${encryptedData}`;
        mailData.rejectLink = `${Env.get(
          'BOOKING_REJECT_BY_CG_LINK',
        )}?booking_id=${encryptedData}`;
        mailData = await this.getDataForSendMailToCaregiver(
          mailData,
          c,
          client,
          date,
          startTime,
          endTime,
          duration,
          services,
        );

        results.push(
          Mail.send(
            c.user.preferred_communication_language === constantMsgs.chinese
              ? 'email.ch.booking-received-caregiver'
              : 'email.en.booking-received-caregiver',
            mailData,
            mail => {
              mail
                .to(mailData.email)
                .from(Env.get('EMAIL_FROM'))
                .subject(
                  c.user.preferred_communication_language ===
                    constantMsgs.chinese
                    ? '需要你確認'
                    : 'Need your confirmation',
                );
            },
          ),

          // sending whatsapp message to CAREGIVER for new requested service
          util.sendWhatsAppMessage(
            c.user.mobile_number,
            `恭喜你！客戶透過Pure Care平台希望你提供上門護理服務。
            \n麻煩你睇吓電郵（包括垃圾郵件夾）了解詳情，電郵入面附有連結以接受或婉拒上門護理要求。
            \n上門護理為先到先得，我們亦都將呢個訊息發送俾另外一至兩位護理員。
            \n聯絡Pure Care?\n電話/Whatsapp: 6364 0301\n電郵: info@purecare.com.hk`,
          ),
        );
      }
      if (results && results.length) {
        await Promise.all(results);
      }
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get mailData for sendMailToCaregiver
   * Params:
   * */
  async getDataForSendMailToCaregiver(
    mailData,
    c,
    client,
    date,
    startTime,
    endTime,
    duration,
    services,
  ) {
    if (c.user.preferred_communication_language !== constantMsgs.chinese) {
      const mailDataRes = await this.getEnglishDataForSendMailToCaregiver(
        mailData,
        client,
        date,
        startTime,
        endTime,
        duration,
        services,
      );
      return mailDataRes;
    }
    const mailDataRes = await this.getChineseDataForSendMailToCaregiver(
      mailData,
      client,
      date,
      startTime,
      endTime,
      duration,
      services,
    );
    return mailDataRes;
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get english mailData for sendMailToCaregiver
   * Params:
   * */
  async getEnglishDataForSendMailToCaregiver(
    mailData,
    client,
    date,
    startTime,
    endTime,
    duration,
    services,
  ) {
    mailData.bookingDate = `${date} between ${startTime} and ${endTime} (${duration} hour(s))`;
    mailData.salute = message.salutation[client.service_user_salute - 1];
    mailData.user_langauge = client.languages.map(el =>
      el.language == '4'
        ? `Dialect: ${el.other_lang}`
        : message.service_user_language[Number(el.language) - 1],
    );
    mailData.address = ` ${client.service_user_building_name}, 
      ${client.service_user_street_name_number}, 
      ${message.location[client.service_user_district - 1]}`;
    mailData.diet = message.service_user_diet[client.service_user_diet - 1];
    mailData.eye_sight =
      message.service_user_eye_sight[client.service_user_eye_sight - 1];
    mailData.hearing =
      message.service_user_hearing[client.service_user_hearing - 1];
    mailData.lifting =
      client.service_user_lifting === '4'
        ? client.service_user_lifting_specific
        : message.service_user_lifting[client.service_user_lifting - 1];
    mailData.medical_history = client.illness.map(el =>
      el.is_specific == '0'
        ? ` ${el.english_title}`
        : el.english_title == 'Cancer'
        ? ` Cancer: ${el.pivot.specific_title}`
        : el.english_title == 'Others'
        ? ` Others: ${el.pivot.specific_title}`
        : ` ${el.pivot.specific_title}`,
    );
    mailData.other_medical_history = client.service_user_other_medical_history
      ? client.service_user_other_medical_history
      : 'None';
    mailData.user_assisting_devices =
      message.service_user_assisting_device[
        Number(client.service_user_assisting_device) - 1
      ] || 'None';
    mailData.user_other_devices =
      client.otherDevices && client.otherDevices.length
        ? client.otherDevices.map(el => {
            if (el.other_device === '4') {
              return ` Drug Allergy: ${el.specific_drug}`;
            }
            return message.service_user_background_others[
              Number(el.other_device) - 1
            ];
          })
        : 'None';
    mailData.selfcare_abilities = client.selfCareAbilities.map(
      el => ` ${el.name}`,
    );
    mailData.selfcare_abilities_with_parent = _(client.selfCareAbilities)
      .groupBy(x => x.parent.name)
      .map((value, key) => ({
        parent: key,
        child: value.map(el => ` ${el.name}`),
      }))
      .value()
      .map(e => {
        const childArray = e.child.map(c => c);
        return `${e.parent}: ${childArray}`;
      });
    mailData.service_needed = services.map(el => el.english_title);
    return mailData;
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get chinese mailData for sendMailToCaregiver
   * Params:
   * */
  async getChineseDataForSendMailToCaregiver(
    mailData,
    client,
    date,
    startTime,
    endTime,
    duration,
    services,
  ) {
    mailData.bookingDate = `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime} (${duration} ${message.additional_ch['hour(s)']})`;
    mailData.salute = message.salutation_ch[client.service_user_salute - 1];
    mailData.user_langauge = client.languages.map(el =>
      el.language == '4'
        ? `${message.additional_ch.Dialect}: ${el.other_lang}`
        : message.service_user_language_ch[Number(el.language) - 1],
    );
    mailData.address = ` ${client.service_user_building_name}, 
    ${client.service_user_street_name_number}, 
    ${message.location_ch[client.service_user_district - 1]}`;
    mailData.diet = message.service_user_diet_ch[client.service_user_diet - 1];
    mailData.eye_sight =
      message.service_user_eye_sight_ch[client.service_user_eye_sight - 1];
    mailData.hearing =
      message.service_user_hearing_ch[client.service_user_hearing - 1];
    mailData.lifting =
      client.service_user_lifting === '4'
        ? client.service_user_lifting_specific
        : message.service_user_lifting_ch[client.service_user_lifting - 1];
    mailData.medical_history = client.illness.map(el =>
      el.is_specific == '0'
        ? ` ${message.illness_ch[el.english_title] || el.english_title}`
        : el.english_title == 'Cancer'
        ? ` ${message.additional_ch.Cancer}: ${el.pivot.specific_title}`
        : el.english_title == 'Others'
        ? ` ${message.additional_ch.Others}: ${el.pivot.specific_title}`
        : ` ${el.pivot.specific_title}`,
    );
    mailData.other_medical_history = client.service_user_other_medical_history
      ? client.service_user_other_medical_history
      : `${message.additional_ch.None}`;
    mailData.user_assisting_devices =
      message.service_user_assisting_device_ch[
        Number(client.service_user_assisting_device) - 1
      ] || `${message.additional_ch.None}`;
    mailData.user_other_devices =
      client.otherDevices && client.otherDevices.length
        ? client.otherDevices.map(el => {
            if (el.other_device === '4') {
              return ` ${message.additional_ch['Drug Allergy']}: ${el.specific_drug}`;
            }
            return message.service_user_background_others_ch[
              Number(el.other_device) - 1
            ];
          })
        : `${message.additional_ch.None}`;
    mailData.selfcare_abilities = client.selfCareAbilities.map(
      el => ` ${message.selfCareAbilities_ch[el.name] || el.name}`,
    );
    mailData.selfcare_abilities_with_parent = _(client.selfCareAbilities)
      .groupBy(x => x.parent.name)
      .map((value, key) => ({
        parent: `${message.selfCareAbilities_ch[key] || key}`,
        child: value.map(
          el => ` ${message.selfCareAbilities_ch[el.name] || el.name}`,
        ),
      }))
      .value()
      .map(e => {
        const childArray = e.child.map(c => c);
        return `${e.parent}: ${childArray}`;
      });
    mailData.service_needed = services.map(
      el => message.services_ch[el.english_title] || el.english_title,
    );
    return mailData;
  }

  /**
   * Name: Nirav Goswami
   * Purpose:Generates DB Distinct Random booking ID
   * Params:
   * */
  async generateDistinctBookingID() {
    const token = randtoken.generate(10);
    const bookingId = await Booking.query()
      .where('booking_id', token)
      .first();
    if (bookingId) {
      this.generateDistinctRandomString();
    }
    return token;
  }

  /**
   * Name: Jainam Shah
   * Purpose: get booking for client / caregiver upcoming, past
   * Params: client, reqData
   * */
  async getBookingForCareOrClient(data, reqData, careOrClient) {
    const recordPerPage = reqData.recordPerPage ? reqData.recordPerPage : 10;
    const pageNumber = reqData.pageNumber ? reqData.pageNumber : 1;
    const offset = (pageNumber - 1) * recordPerPage;
    const qb = Booking.query();

    if (careOrClient === 'client') {
      qb.where('client_id', data.id);
    } else if (careOrClient === 'caregiver') {
      qb.whereHas('caregiverDetail', caregiverDetailQuery => {
        caregiverDetailQuery.where('caregiver_id', data.id);
      });
    }

    const dateOnly = moment()
      .format('YYYY-MM-DD HH:mm:ss')
      .toString();

    if (reqData.appointment === 'upcoming') {
      qb.where('date', '>', dateOnly);

      if (reqData.upcomingStatus === 'confirmed') {
        qb.where('status', constantMsgs.accepted);
        qb.whereHas('caregiverDetail', caregiverDetailQuery => {
          caregiverDetailQuery.where('status', constantMsgs.accepted);
        });
      } else {
        qb.where('status', constantMsgs.awaiting);
      }
    } else if (reqData.pendingStatus === 'cancelled') {
      qb.where('status', constantMsgs.cancelled);
    } else {
      qb.where('date', '<', dateOnly);
      qb.where('status', constantMsgs.accepted);
    }

    // Relations
    qb.with('services', serviceQuery => {
      serviceQuery.select('id', 'english_title');
    });
    qb.with('caregiverDetail', caregiverDetailQuery => {
      caregiverDetailQuery.select(
        'id',
        'caregiver_booking_id',
        'caregiver_id',
        'caregiver_charges_hour',
        'caregiver_charges_price',
        'total_amount',
        'caregiver_charges',
        'caregiver_service_fee',
        'client_service_fee',
        'status',
        'is_cancelled',
      );
      caregiverDetailQuery.with('caregiver', caregiverQuery => {
        caregiverQuery.select(
          'id',
          'registration_no',
          'chinese_name',
          'english_name',
          'nick_name',
          'hkid_card_no',
          'caregiver_type',
        );
      });
    });
    qb.with('client', clientQuery => {
      clientQuery.select(
        'id',
        'user_id',
        'first_name',
        'last_name',
        'home_telephone_number',
        'service_user_salute',
        'service_user_firstname',
        'service_user_lastname',
      );

      clientQuery.with('user', userQuery => {
        userQuery.select(
          'id',
          'email',
          'mobile_number',
          'preferred_communication_language',
        );
      });
    });
    qb.orderBy('created_at', 'desc');
    const count = await qb.getCount();

    // Pagination
    qb.limit(recordPerPage);
    qb.offset(offset);

    const bookings = await qb.fetch();

    return { bookings, count, recordPerPage, pageNumber };
  }

  /**
   * Name: Nirav Goswami
   * Purpose:check Booking exsist for given caregiver/client
   * Params: reqData
   * */
  async checkBooking(reqData) {
    const qb = Booking.query();

    qb.where('booking_id', reqData.booking_id);

    if (reqData.slug) {
      qb.whereHas('client', clientQuery => {
        clientQuery.where('slug', reqData.slug);
      });
    }
    if (reqData.registration_no) {
      qb.whereHas('caregiverDetail', caregiverDetailQuery => {
        caregiverDetailQuery.whereHas('caregiver', caregiverQuery => {
          caregiverQuery.where('registration_no', reqData.registration_no);
        });
      });
    }
    qb.with('client', clientQuery => {
      clientQuery.select(
        'id',
        'user_id',
        'first_name',
        'last_name',
        'home_telephone_number',
        'service_user_salute',
        'service_user_firstname',
        'service_user_lastname',
      );

      clientQuery.with('user', userQuery => {
        userQuery.select(
          'id',
          'email',
          'mobile_number',
          'preferred_communication_language',
        );
      });
    });

    // Relations
    qb.with('services', serviceQuery => {
      serviceQuery.select('id', 'english_title');
    });
    qb.with('caregiverDetail', caregiverDetailQuery => {
      caregiverDetailQuery.select(
        'id',
        'caregiver_booking_id',
        'caregiver_id',
        'caregiver_charges_hour',
        'caregiver_charges_price',
        'total_amount',
        'caregiver_charges',
        'caregiver_service_fee',
        'client_service_fee',
        'status',
        'is_cancelled',
      );
      caregiverDetailQuery.with('caregiver', caregiverQuery => {
        caregiverQuery.select(
          'id',
          'registration_no',
          'chinese_name',
          'english_name',
          'nick_name',
          'hkid_card_no',
          'caregiver_type',
        );
      });
    });

    const booking = await qb.first();

    return booking;
  }

  /**
   * Name: Nirav Goswami
   * Purpose: accept Booking by caregiver
   * Params: reqData
   * */
  async acceptBooking(booking, reqData) {
    const trx = await database.beginTransaction();
    try {
      // booking details accepting...
      const caregiverDetail = await booking
        .caregiverDetail()
        .whereHas('caregiver', caregiverQuery => {
          caregiverQuery.where('registration_no', reqData.registration_no);
        })
        .first();

      caregiverDetail.status = '2';
      await caregiverDetail.save(trx);

      // email for accepted booking service by caregiver...
      const caregiver = await Caregiver.query()
        .with('user')
        .where('registration_no', reqData.registration_no)
        .first();
      const nickName = caregiver.toJSON().nick_name;
      const regNo = caregiver.toJSON().registration_no;
      booking = booking.toJSON();

      // const chargesDetails = booking.caregiverDetail.find(
      //   e =>
      //     e.caregiver_id === caregiver.toJSON().id &&
      //     e.caregiver_booking_id === booking.id,
      // );

      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      const { 0: caregiverBookingDetails } = booking.caregiverDetail.map(
        el => el,
      );

      let mailData = {
        email: booking.client.user.email,
        caregiverName: nickName,
        regNo,
        accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
        serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
        bookingDate: `${date} between ${startTime} and ${endTime} (${booking.duration} hour(s))`,
        // final amount
        subsidy: booking.transport_subsidy ? booking.transport_subsidy : '0',
        user_caregiver_charges: caregiverBookingDetails.caregiver_charges,
        user_client_service_fee:
          caregiverBookingDetails.client_service_fee || '0'
            ? caregiverBookingDetails.client_service_fee
            : '0',
        total_amount: caregiverBookingDetails.total_amount,
      };
      if (
        booking.client.user.preferred_communication_language ===
        constantMsgs.chinese
      ) {
        mailData = {
          email: booking.client.user.email,
          caregiverName: nickName,
          regNo,
          accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
          serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
          bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime} (${booking.duration} ${message.additional_ch['hour(s)']})`,
          // final amount
          subsidy: booking.transport_subsidy ? booking.transport_subsidy : '0',
          user_caregiver_charges: caregiverBookingDetails.caregiver_charges,
          user_client_service_fee:
            caregiverBookingDetails.client_service_fee || '0'
              ? caregiverBookingDetails.client_service_fee
              : '0',
          total_amount: caregiverBookingDetails.total_amount,
        };
      }
      await Mail.send(
        booking.client.user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.booking-accepted-client'
          : 'email.en.booking-accepted-client',
        mailData,
        mail => {
          mail
            .to(mailData.email)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              booking.client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '請付款 – 護理員已確認! (第2/3步)'
                : 'Payment – Caregiver Confirmed!(Step 2/3)',
            );
        },
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service acceptBooking Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Nirav Goswami
   * Purpose: reject Booking by caregiver
   * Params: reqData
   * */
  async rejectBooking(booking, reqData) {
    const trx = await database.beginTransaction();
    try {
      // booking details rejecting...
      const caregiverDetail = await booking
        .caregiverDetail()
        .whereHas('caregiver', caregiverQuery => {
          caregiverQuery.where('registration_no', reqData.registration_no);
        })
        .first();
      caregiverDetail.status = '3';
      await caregiverDetail.save(trx);

      // email for rejected booking service by caregiver...
      const caregiver = await Caregiver.query()
        .where('registration_no', reqData.registration_no)
        .first();
      const englishName = caregiver.toJSON().english_name;
      booking = booking.toJSON();

      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      let mailData = {
        email: booking.client.user.email,
        caregiverName: `${englishName}`,
        accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
        accountUserMobile: `${booking.client.user.mobile_number} `,
        serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
        bookingDate: `${date} between ${startTime} and ${endTime} (${booking.duration} hour(s))`,
      };
      if (
        booking.client.user.preferred_communication_language ===
        constantMsgs.chinese
      ) {
        mailData = {
          email: booking.client.user.email,
          caregiverName: `${englishName}`,
          accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
          accountUserMobile: `${booking.client.user.mobile_number} `,
          serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
          bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime} (${booking.duration} ${message.additional_ch['hour(s)']})`,
        };
      }
      await Mail.send(
        booking.client.user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.booking-rejected-client'
          : 'email.en.booking-rejected-client',
        mailData,
        mail => {
          mail
            .to(mailData.email)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              booking.client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '婉拒預約'
                : 'Declined Appointment',
            );
        },
      );

      let bookingData = await Booking.query()
        .with('caregiverDetail')
        .where('booking_id', reqData.booking_id)
        .first();

      if (bookingData && bookingData.caregiverDetail) {
        bookingData = bookingData.toJSON();
        const allRejected = bookingData.caregiverDetail.filter(
          c => c.status === constantMsgs.rejected,
        );

        const adminMails = await database
          .from('users')
          .pluck('email')
          .where('user_type', constantMsgs.awaiting);

        // mail for Admin
        await Mail.send('email.en.booking-cancelled-admin', mailData, mail => {
          mail
            .to(adminMails)
            .from(Env.get('EMAIL_FROM'))
            .subject('Caregiver cancelled the appointment');
        });

        if (allRejected.length + 1 === bookingData.caregiverDetail.length) {
          await Booking.query()
            .where('id', bookingData.id)
            .transacting(trx)
            .update({ status: constantMsgs.cancelled, cancelled_by: '2' });
          // sending whatsapp message to CLIENT for cancelled service
          util.sendWhatsAppMessage(
            booking.client.user.mobile_number,
            '唔好意思，今次未有護理員能夠提供上門服務! 今次嘅預約將會取消。',
          );
        }
      }
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service rejectBooking Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: to check if caregiver is free in this slot
   * Params: booking data
   * */
  async checkCaregiverIsFree(data, reqData, byAdmin) {
    const caregiver = await Caregiver.query()
      .where('registration_no', reqData.registration_no)
      .first();
    const caregiverId = caregiver.toJSON().id;

    const dateOnly = moment(data.date)
      .format('YYYY-MM-DD')
      .toString();
    const startTime = moment(data.start_time)
      .format('YYYY-MM-DD HH:mm')
      .toString();
    const endTime = moment(data.end_time)
      .format('YYYY-MM-DD HH:mm')
      .toString();

    const qb = Booking.query()
      // .whereRaw('start_time >= ? AND ? <= end_time', [startTime, startTime])
      // .whereRaw('end_time >= ? AND ? <= end_time', [endTime, endTime])
      .whereRaw(
        database.raw(
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
      )
      .whereRaw('CAST(date AS DATE) = ?', [dateOnly])
      .whereHas('caregiverDetail', caregiverDetailBuilder => {
        caregiverDetailBuilder.where('caregiver_id', caregiverId);
        caregiverDetailBuilder.where('status', constantMsgs.accepted);
      });
    if (byAdmin) {
      // If booking status is confirmed=2 by Admin
      qb.where('status', '2');
    } else {
      // If booking status is awaiting_for_response=1 or confirmed=2 by Admin
      qb.whereIn('status', ['1', '2']);
    }

    const bookingData = await qb.fetch();
    return bookingData.toJSON();
  }

  async getClientData(clientId) {
    let client = await Client.query()
      .where('id', clientId)
      .with('languages', languagesQuery => {
        languagesQuery.select('id', 'client_id', 'language', 'other_lang');
      })
      .with('illness', query => {
        query
          .select('id', 'english_title', 'is_specific')
          .withPivot('specific_title');
      })
      .with('otherDevices', otherDevicesQuery => {
        otherDevicesQuery.select(
          'id',
          'client_id',
          'other_device',
          'specific_drug',
        );
      })
      .with('selfCareAbilities', selfCareAbilitiesQuery => {
        selfCareAbilitiesQuery
          .select('id', 'name', 'parent_id')
          .with('parent', query => {
            query.select('id', 'name');
          });
      })
      .first();
    client = client.toJSON();
    return client;
  }

  /**
   * Name: Jainam Shah
   * Purpose: confirmation of Booking by admin
   * Params: reqData
   * */
  async confirmBooking(booking, reqData) {
    const trx = await database.beginTransaction();
    try {
      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      // booking details confirming...
      booking.status = constantMsgs.accepted;
      booking.payment_status = '2';
      booking.payment_date_client = reqData.payment_date_client;
      let totalBookingForTheDay = await Booking.query()
        .whereRaw('CAST(date AS DATE) = ?', date)
        .where('status', constantMsgs.accepted)
        .getCount();

      totalBookingForTheDay =
        totalBookingForTheDay > 0 ? totalBookingForTheDay + 1 : 1;
      const receiptNumber = `R-${moment(date).format(
        'YYYYMMDD',
      )}-${totalBookingForTheDay}`;
      booking.receipt_number = receiptNumber;
      await booking.save(trx);

      const client = await this.getClientData(booking.client_id);

      // email for confirmed booking service by admin...
      const caregiver = await Caregiver.query()
        .with('user')
        .where('registration_no', reqData.registration_no)
        .first();
      const englishName = caregiver.toJSON().nick_name;
      booking = booking.toJSON();

      // mail data
      const { 0: caregiverBookingDetails } = booking.caregiverDetail.map(
        el => el,
      );

      const user = await User.find(booking.client.user.id);
      user.total_service_fee += caregiverBookingDetails.client_service_fee;
      await user.save(trx);

      let mailData = {
        clientEmail: booking.client.user.email,
        caregiverEmail: caregiver.toJSON().user.email,
        caregiverName: `${englishName}`,
        caregiverNickName: caregiver.toJSON().nick_name,
        registrationNo: caregiver.toJSON().registration_no,
        accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
        receiptNumber,
        serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
        dob: moment(client.service_user_dob).format('YYYY-MM-DD'),
        weight: client.service_user_weight,
        height: client.service_user_height,
        physical_ability: client.service_user_physical_ability,
        left_hand: client.service_user_left_hand_mobility,
        right_hand: client.service_user_right_hand_mobility,
        right_leg: client.service_user_lower_right_leg_limb_mobility,
        left_leg: client.service_user_lower_left_leg_limb_mobility,
        user_caregiver_charges: caregiverBookingDetails.caregiver_charges,
        user_client_service_fee: caregiverBookingDetails.client_service_fee
          ? caregiverBookingDetails.client_service_fee
          : '0',
        subsidy: booking.transport_subsidy ? booking.transport_subsidy : '0',
        total_amount: caregiverBookingDetails.total_amount,
      };

      mailData = await this.getDataForConfirmBooking(
        mailData,
        caregiver,
        client,
        booking,
        date,
        startTime,
        endTime,
      );
      let mailDataClient = mailData;

      if (
        booking.client.user.preferred_communication_language ===
        constantMsgs.chinese
      ) {
        mailDataClient = await this.getClientChineseDataConfirmBooking(
          mailData,
          caregiver,
          client,
          booking,
          date,
          startTime,
          endTime,
        );
      }

      // mail for caregiver
      await Mail.send(
        caregiver.toJSON().user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.booking-confirmed-caregiver'
          : 'email.en.booking-confirmed-caregiver',
        mailData,
        mail => {
          mail
            .to(mailData.caregiverEmail)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              caregiver.toJSON().user.preferred_communication_language ===
                constantMsgs.chinese
                ? '服務已確認!'
                : 'Appointment Confirmation!',
            );
        },
      );

      // mail for client
      await Mail.send(
        booking.client.user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.booking-confirmed-client'
          : 'email.en.booking-confirmed-client',
        mailDataClient,
        mail => {
          mail
            .to(mailDataClient.clientEmail)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              booking.client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '服務已確認!(第3/3步)'
                : 'Appointment Confirmation! (Step 3/3)',
            );
        },
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service confirmBooking Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get mailData for confirmBooking
   * Params:
   * */
  async getDataForConfirmBooking(
    mailData,
    caregiver,
    client,
    booking,
    date,
    startTime,
    endTime,
  ) {
    if (
      caregiver.toJSON().user.preferred_communication_language !==
      constantMsgs.chinese
    ) {
      const mailDataRes = await this.getEnglishDataForConfirmBooking(
        mailData,
        caregiver,
        client,
        booking,
        date,
        startTime,
        endTime,
      );
      return mailDataRes;
    }
    const mailDataRes = await this.getChineseDataForConfirmBooking(
      mailData,
      caregiver,
      client,
      booking,
      date,
      startTime,
      endTime,
    );
    return mailDataRes;
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get english data for mailData for confirmBooking
   * Params:
   * */
  async getEnglishDataForConfirmBooking(
    mailDataOrg,
    caregiver,
    client,
    booking,
    date,
    startTime,
    endTime,
  ) {
    const mailData = JSON.parse(JSON.stringify(mailDataOrg));
    mailData.caregiverType =
      message.caregiver_type[Number(caregiver.toJSON().caregiver_type) - 1];
    mailData.bookingDate = `${date} between ${startTime} and ${endTime} (${booking.duration} hour(s))`;
    mailData.address = `Flat Number: ${client.service_user_flat_no}, 
      Floor Number: ${client.service_user_floor_no}, 
      ${client.service_user_building_name}, 
      ${client.service_user_street_name_number}, 
      ${message.location[client.service_user_district - 1]}`;
    mailData.salute = message.salutation[client.service_user_salute - 1];
    mailData.language = client.languages.map(el =>
      el.language == '4'
        ? `Dialect: ${el.other_lang}`
        : message.service_user_language[Number(el.language) - 1],
    );
    mailData.diet = message.service_user_diet[client.service_user_diet - 1];
    mailData.eye_sight =
      message.service_user_eye_sight[client.service_user_eye_sight - 1];
    mailData.hearing =
      message.service_user_hearing[client.service_user_hearing - 1];
    mailData.lifting =
      client.service_user_lifting === '4'
        ? client.service_user_lifting_specific
        : message.service_user_lifting[client.service_user_lifting - 1];
    mailData.medical_history = client.illness.map(el =>
      el.is_specific == '0'
        ? ` ${el.english_title}`
        : el.english_title == 'Cancer'
        ? ` Cancer: ${el.pivot.specific_title}`
        : el.english_title == 'Others'
        ? ` Others: ${el.pivot.specific_title}`
        : ` ${el.pivot.specific_title}`,
    );
    mailData.other_medical_history = client.service_user_other_medical_history
      ? client.service_user_other_medical_history
      : 'None';
    mailData.user_assisting_devices =
      message.service_user_assisting_device[
        Number(client.service_user_assisting_device) - 1
      ] || 'None';
    mailData.user_other_devices =
      client.otherDevices && client.otherDevices.length
        ? client.otherDevices.map(el => {
            if (el.other_device === '4') {
              return ` Drug Allergy: ${el.specific_drug}`;
            }
            return message.service_user_background_others[
              Number(el.other_device) - 1
            ];
          })
        : 'None';
    mailData.selfcare_abilities = client.selfCareAbilities.map(
      el => `${el.name} `,
    );
    mailData.selfcare_abilities_with_parent = _(client.selfCareAbilities)
      .groupBy(x => x.parent.name)
      .map((value, key) => ({
        parent: key,
        child: value.map(el => ` ${el.name}`),
      }))
      .value()
      .map(e => {
        const childArray = e.child.map(c => c);
        return `${e.parent}: ${childArray}`;
      });
    mailData.service_needed = booking.services.map(el => el.english_title);
    return mailData;
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get chinese data for mailData for confirmBooking
   * Params:
   * */
  async getChineseDataForConfirmBooking(
    mailDataOrg,
    caregiver,
    client,
    booking,
    date,
    startTime,
    endTime,
  ) {
    const mailData = JSON.parse(JSON.stringify(mailDataOrg));
    mailData.caregiverType =
      message.caregiver_type_ch[Number(caregiver.toJSON().caregiver_type) - 1];
    mailData.bookingDate = `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime} (${booking.duration} ${message.additional_ch['hour(s)']})`;
    mailData.address = `${message.additional_ch['Flat Number']}: 
      ${client.service_user_flat_no}, 
      ${message.additional_ch['Floor Number']}: ${
      client.service_user_floor_no
    }, 
      ${client.service_user_building_name}, 
      ${client.service_user_street_name_number}, 
      ${message.location_ch[client.service_user_district - 1]}`;
    mailData.salute = message.salutation_ch[client.service_user_salute - 1];
    mailData.language = client.languages.map(el =>
      el.language == '4'
        ? `${message.additional_ch.Dialect}: ${el.other_lang}`
        : message.service_user_language_ch[Number(el.language) - 1],
    );
    mailData.diet = message.service_user_diet_ch[client.service_user_diet - 1];
    mailData.eye_sight =
      message.service_user_eye_sight_ch[client.service_user_eye_sight - 1];
    mailData.hearing =
      message.service_user_hearing_ch[client.service_user_hearing - 1];
    mailData.lifting =
      client.service_user_lifting === '4'
        ? client.service_user_lifting_specific
        : message.service_user_lifting_ch[client.service_user_lifting - 1];
    mailData.medical_history = client.illness.map(el =>
      el.is_specific == '0'
        ? `  ${message.illness_ch[el.english_title] || el.english_title}`
        : el.english_title == 'Cancer'
        ? ` ${message.additional_ch.Cancer}: ${el.pivot.specific_title}`
        : el.english_title == 'Others'
        ? ` ${message.additional_ch.Others}: ${el.pivot.specific_title}`
        : ` ${el.pivot.specific_title}`,
    );
    mailData.other_medical_history = client.service_user_other_medical_history
      ? client.service_user_other_medical_history
      : `${message.additional_ch.None}`;
    mailData.user_assisting_devices =
      message.service_user_assisting_device_ch[
        Number(client.service_user_assisting_device) - 1
      ] || `${message.additional_ch.None}`;
    mailData.user_other_devices =
      client.otherDevices && client.otherDevices.length
        ? client.otherDevices.map(el => {
            if (el.other_device === '4') {
              return ` ${message.additional_ch['Drug Allergy']}: ${el.specific_drug}`;
            }
            return message.service_user_background_others_ch[
              Number(el.other_device) - 1
            ];
          })
        : `${message.additional_ch.None}`;
    mailData.selfcare_abilities = client.selfCareAbilities.map(
      el => `${message.selfCareAbilities_ch[el.name] || el.name} `,
    );
    mailData.selfcare_abilities_with_parent = _(client.selfCareAbilities)
      .groupBy(x => x.parent.name)
      .map((value, key) => ({
        parent: `${message.selfCareAbilities_ch[key] || key}`,
        child: value.map(
          el => ` ${message.selfCareAbilities_ch[el.name] || el.name}`,
        ),
      }))
      .value()
      .map(e => {
        const childArray = e.child.map(c => c);
        return `${e.parent}: ${childArray}`;
      });
    mailData.service_needed = booking.services.map(
      el => message.services_ch[el.english_title] || el.english_title,
    );
    return mailData;
  }

  /**
   * Name: Jainam Shah
   * Purpose: to get chinese data (client) for mailData for confirmBooking
   * Params:
   * */
  async getClientChineseDataConfirmBooking(
    mailDataOrg,
    caregiver,
    client,
    booking,
    date,
    startTime,
    endTime,
  ) {
    const mailData = JSON.parse(JSON.stringify(mailDataOrg));
    mailData.caregiverType =
      message.caregiver_type_ch[Number(caregiver.toJSON().caregiver_type) - 1];
    mailData.bookingDate = `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime} (${booking.duration} ${message.additional_ch['hour(s)']})`;
    mailData.address = `${message.additional_ch['Flat Number']}: 
      ${client.service_user_flat_no}, 
      ${message.additional_ch['Floor Number']}: 
      ${client.service_user_floor_no}, 
      ${client.service_user_building_name}, 
      ${client.service_user_street_name_number}, 
      ${message.location_ch[client.service_user_district - 1]}`;
    mailData.salute = message.salutation_ch[client.service_user_salute - 1];
    mailData.language = client.languages.map(el =>
      el.language == '4'
        ? `${message.additional_ch.Dialect}: ${el.other_lang}`
        : message.service_user_language_ch[Number(el.language) - 1],
    );
    mailData.diet = message.service_user_diet_ch[client.service_user_diet - 1];
    mailData.eye_sight =
      message.service_user_eye_sight_ch[client.service_user_eye_sight - 1];
    mailData.hearing =
      message.service_user_hearing_ch[client.service_user_hearing - 1];
    mailData.lifting =
      client.service_user_lifting === '4'
        ? client.service_user_lifting_specific
        : message.service_user_lifting_ch[client.service_user_lifting - 1];
    mailData.medical_history = client.illness.map(el =>
      el.is_specific == '0'
        ? `  ${message.illness_ch[el.english_title] || el.english_title}`
        : el.english_title == 'Cancer'
        ? ` ${message.additional_ch.Cancer}: ${el.pivot.specific_title}`
        : el.english_title == 'Others'
        ? ` ${message.additional_ch.Others}: ${el.pivot.specific_title}`
        : ` ${el.pivot.specific_title}`,
    );
    mailData.other_medical_history = client.service_user_other_medical_history
      ? client.service_user_other_medical_history
      : `${message.additional_ch.None}`;
    mailData.user_assisting_devices =
      message.service_user_assisting_device_ch[
        Number(client.service_user_assisting_device) - 1
      ] || `${message.additional_ch.None}`;
    mailData.user_other_devices =
      client.otherDevices && client.otherDevices.length
        ? client.otherDevices.map(el => {
            if (el.other_device === '4') {
              return ` ${message.additional_ch['Drug Allergy']}: ${el.specific_drug}`;
            }
            return message.service_user_background_others_ch[
              Number(el.other_device) - 1
            ];
          })
        : `${message.additional_ch.None}`;
    mailData.selfcare_abilities = client.selfCareAbilities.map(
      el => `${message.selfCareAbilities_ch[el.name] || el.name} `,
    );
    mailData.selfcare_abilities_with_parent = _(client.selfCareAbilities)
      .groupBy(x => x.parent.name)
      .map((value, key) => ({
        parent: `${message.selfCareAbilities_ch[key] || key}`,
        child: value.map(
          el => ` ${message.selfCareAbilities_ch[el.name] || el.name}`,
        ),
      }))
      .value()
      .map(e => {
        const childArray = e.child.map(c => c);
        return `${e.parent}: ${childArray}`;
      });
    mailData.service_needed = booking.services.map(
      el => message.services_ch[el.english_title] || el.english_title,
    );
    mailData.subsidy = booking.transport_subsidy
      ? booking.transport_subsidy
      : '0';
    return mailData;
  }

  /**
   * Name: Jainam Shah
   * Purpose: cancel booking service by client
   * Params: bookingData, reqData
   * */
  async cancelBookingByClient(booking, reqData) {
    const trx = await database.beginTransaction();
    try {
      booking.status = constantMsgs.cancelled;
      booking.cancelled_by = '3';

      let bookingData = await Booking.query()
        .with('caregiverDetail')
        .with('caregiverDetail.caregiver')
        .with('caregiverDetail.caregiver.user')
        // Only Accepted Caregiver -> Removed by Chris
        // .whereHas('caregiverDetail', detailBuilder => {
        //   detailBuilder.where('status', '2');
        // })
        .where('booking_id', reqData.booking_id)
        .first();

      if (bookingData && bookingData.caregiverDetail) {
        bookingData = bookingData.toJSON();
        const results = [];
        const date = moment(booking.date).format('YYYY-MM-DD');
        const startTime = moment(booking.start_time).format('hh:mm A');
        let endTime = moment(booking.end_time).format('hh:mm A');

        if (endTime === '11:59 PM') {
          endTime = '12:00 AM';
        }

        for (const c of bookingData.caregiverDetail) {
          let mailData = {
            email: c.caregiver.user.email,
            caregiverName: `${c.caregiver.english_name}`,
            accountUserName: `${booking.toJSON().client.first_name} 
              ${booking.toJSON().client.last_name}`,
            serviceUserName: `${booking.toJSON().client.service_user_firstname} 
              ${booking.toJSON().client.service_user_lastname}`,
            bookingDate: `${date} between ${startTime} and ${endTime}`,
          };

          if (
            c.caregiver.user.preferred_communication_language ===
            constantMsgs.chinese
          ) {
            mailData = {
              email: c.caregiver.user.email,
              caregiverName: `${c.caregiver.english_name}`,
              accountUserName: `${booking.toJSON().client.first_name} 
                ${booking.toJSON().client.last_name}`,
              serviceUserName: `${
                booking.toJSON().client.service_user_firstname
              } 
                ${booking.toJSON().client.service_user_lastname}`,
              bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime}`,
            };
          }

          results.push(
            Mail.send(
              c.caregiver.user.preferred_communication_language ===
                constantMsgs.chinese
                ? 'email.ch.booking-cancelled-caregiver'
                : 'email.en.booking-cancelled-caregiver',
              mailData,
              mail => {
                mail
                  .to(mailData.email)
                  .from(Env.get('EMAIL_FROM'))
                  .subject(
                    c.caregiver.user.preferred_communication_language ===
                      constantMsgs.chinese
                      ? '取消預約'
                      : 'Cancelled Appointment',
                  );
              },
            ),

            // sending whatsapp message to CAREGIVER for cancelled service
            util.sendWhatsAppMessage(
              c.caregiver.user.mobile_number,
              '唔好意思!今次嘅預約已經取消。放心，再有預約我地會第一時間通知你!',
            ),
          );
        }
        if (results && results.length) {
          await Promise.all(results);
        }
      }

      const mailDataClient = {
        clientEmail: booking.toJSON().client.user.email,
      };

      // mail for client
      await Mail.send(
        booking.toJSON().client.user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.booking-cancelled-client'
          : 'email.en.booking-cancelled-client',
        mailDataClient,
        mail => {
          mail
            .to(mailDataClient.clientEmail)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              booking.toJSON().client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '取消預約'
                : 'Cancelled Appointment',
            );
        },
      );

      // sending whatsapp message to CLIENT for cancelled service
      util.sendWhatsAppMessage(
        booking.toJSON().client.user.mobile_number,
        '唔好意思!今次嘅預約已經取消。麻煩你再次到訪www.purecare.com.hk選擇合適既日子時間啦!',
      );

      await booking.save(trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service cancelBookingByClient Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: cancel booking service by caregiver
   * Params: bookingData, reqData
   * */
  async cancelBookingByCaregiver(booking, reqData) {
    const trx = await database.beginTransaction();
    try {
      const caregiverDetail = await booking
        .caregiverDetail()
        .whereHas('caregiver', caregiverQuery => {
          caregiverQuery.where('registration_no', reqData.registration_no);
        })
        .first();
      caregiverDetail.is_cancelled = constantMsgs.isCancelled;
      await caregiverDetail.save(trx);

      // mail data
      const caregiver = await Caregiver.query()
        .with('user')
        .where('registration_no', reqData.registration_no)
        .first();
      const englishName = caregiver.toJSON().english_name;
      booking = booking.toJSON();

      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      let mailData = {
        clientEmail: booking.client.user.email,
        caregiverName: `${englishName}`,
        accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
        serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
        bookingDate: `${date} between ${startTime} and ${endTime}`,
      };

      if (
        booking.client.user.preferred_communication_language ===
        constantMsgs.chinese
      ) {
        mailData = {
          clientEmail: booking.client.user.email,
          caregiverName: `${englishName}`,
          accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
          serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
          bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime}`,
        };
      }
      const adminMails = await database
        .from('users')
        .pluck('email')
        .where('user_type', '1');

      // mail for client
      await Mail.send(
        booking.client.user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.booking-cancelled-client'
          : 'email.en.booking-cancelled-client',
        mailData,
        mail => {
          mail
            .to(mailData.clientEmail)
            .bcc(adminMails)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              booking.client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '取消預約'
                : 'Cancelled Appointment',
            );
        },
      );

      // sending whatsapp message to CLIENT for cancelled service
      util.sendWhatsAppMessage(
        booking.client.user.mobile_number,
        '唔好意思!今次嘅預約已經取消。麻煩你再次到訪www.purecare.com.hk選擇合適既日子時間啦!',
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service cancelBookingByCaregiver Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: cancel booking service by Admin
   * Params: bookingData, reqData
   * */
  async cancelBookingByAdmin(booking, reqData) {
    const trx = await database.beginTransaction();
    try {
      booking.status = '4';
      booking.cancelled_by = '1';
      await booking.save(trx);

      let bookingData = await Booking.query()
        .with('caregiverDetail')
        .with('caregiverDetail.caregiver')
        .with('caregiverDetail.caregiver.user')
        .whereHas('caregiverDetail', detailBuilder => {
          detailBuilder.where('status', constantMsgs.accepted);
        })
        .where('booking_id', reqData.booking_id)
        .first();

      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      if (bookingData && bookingData.caregiverDetail) {
        bookingData = bookingData.toJSON();
        const results = [];

        for (const c of bookingData.caregiverDetail) {
          let mailData = {
            email: c.caregiver.user.email,
            caregiverName: `${c.caregiver.english_name}`,
            accountUserName: `${booking.toJSON().client.first_name} 
              ${booking.toJSON().client.last_name}`,
            serviceUserName: `${booking.toJSON().client.service_user_firstname} 
              ${booking.toJSON().client.service_user_lastname}`,
            bookingDate: `${date} between ${startTime} and ${endTime}`,
          };

          if (
            c.caregiver.user.preferred_communication_language ===
            constantMsgs.chinese
          ) {
            mailData = {
              email: c.caregiver.user.email,
              caregiverName: `${c.caregiver.english_name}`,
              accountUserName: `${booking.toJSON().client.first_name} 
                ${booking.toJSON().client.last_name}`,
              serviceUserName: `${
                booking.toJSON().client.service_user_firstname
              } 
                ${booking.toJSON().client.service_user_lastname}`,
              bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime}`,
            };
          }

          results.push(
            // sending email to CAREGIVER for cancelled service
            Mail.send(
              c.caregiver.user.preferred_communication_language ===
                constantMsgs.chinese
                ? 'email.ch.cancelled-by-admin-caregiver'
                : 'email.en.cancelled-by-admin-caregiver',
              mailData,
              mail => {
                mail
                  .to(mailData.email)
                  .from(Env.get('EMAIL_FROM'))
                  .subject(
                    c.caregiver.user.preferred_communication_language ===
                      constantMsgs.chinese
                      ? '取消預約'
                      : 'Cancelled Appointment',
                  );
              },
            ),

            // sending whatsapp message to CAREGIVER for cancelled service
            util.sendWhatsAppMessage(
              c.caregiver.user.mobile_number,
              '唔好意思!今次嘅預約已經取消。放心，再有預約我地會第一時間通知你!',
            ),
          );
        }
        if (results && results.length) {
          await Promise.all(results);
        }
      }

      booking = booking.toJSON();

      // CLIENT
      let mailData1 = {
        clientEmail: booking.client.user.email,
        accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
        serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
        bookingDate: `${date} between ${startTime} and ${endTime}`,
      };

      if (
        booking.client.user.preferred_communication_language ===
        constantMsgs.chinese
      ) {
        mailData1 = {
          clientEmail: booking.client.user.email,
          accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
          serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
          bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime}`,
        };
      }

      // mail for client
      await Mail.send(
        booking.client.user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.cancelled-by-admin-client'
          : 'email.en.cancelled-by-admin-client',
        mailData1,
        mail => {
          mail
            .to(mailData1.clientEmail)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              booking.client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '取消預約'
                : 'Cancelled Appointment',
            );
        },
      );

      // sending whatsapp message to CLIENT for cancelled service
      util.sendWhatsAppMessage(
        booking.client.user.mobile_number,
        '唔好意思!今次嘅預約已經取消。麻煩你再次到訪www.purecare.com.hk選擇合適既日子時間啦!',
      );

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      Logger.info('Service cancelBookingByAdmin Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: send booking change date mail to client and caregiver
   * Params: booking
   * */
  async sendDateChangeMail(booking) {
    try {
      booking = booking.toJSON();

      const date = moment(booking.date).format('YYYY-MM-DD');
      const startTime = moment(booking.start_time).format('hh:mm A');
      let endTime = moment(booking.end_time).format('hh:mm A');

      if (endTime === '11:59 PM') {
        endTime = '12:00 AM';
      }

      // CLIENT
      let mailData1 = {
        clientEmail: booking.client.user.email,
        accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
        serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
        bookingDate: `${date} between ${startTime} and ${endTime}`,
      };
      if (
        booking.client.user.preferred_communication_language ===
        constantMsgs.chinese
      ) {
        mailData1 = {
          clientEmail: booking.client.user.email,
          accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
          serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
          bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime}`,
        };
      }

      await Mail.send(
        booking.client.user.preferred_communication_language ===
          constantMsgs.chinese
          ? 'email.ch.booking-date-changes-client'
          : 'email.en.booking-date-changes-client',
        mailData1,
        mail => {
          mail
            .to(mailData1.clientEmail)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              booking.client.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '更改預約'
                : 'Change of Appointment',
            );
        },
      );

      const acceptedCaregiver = booking.caregiverDetail.filter(
        e => e.status === constantMsgs.accepted,
      )[0];
      let caregiver = await Caregiver.query()
        .where('id', acceptedCaregiver.caregiver_id)
        .with('user')
        .first();
      caregiver = caregiver.toJSON();
      // Caregiver
      let mailData = {
        email: caregiver.user.email,
        caregiverName: `${caregiver.english_name}`,
        accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
        serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
        bookingDate: `${date} between ${startTime} and ${endTime}`,
      };
      if (
        caregiver.user.preferred_communication_language === constantMsgs.chinese
      ) {
        mailData = {
          email: caregiver.user.email,
          caregiverName: `${caregiver.english_name}`,
          accountUserName: `${booking.client.first_name} ${booking.client.last_name}`,
          serviceUserName: `${booking.client.service_user_firstname} ${booking.client.service_user_lastname}`,
          bookingDate: `${date} ${message.additional_ch.between} ${startTime} ${message.additional_ch.and} ${endTime}`,
        };
      }
      Mail.send(
        caregiver.user.preferred_communication_language === constantMsgs.chinese
          ? 'email.ch.booking-date-changes-caregiver'
          : 'email.en.booking-date-changes-caregiver',
        mailData,
        mail => {
          mail
            .to(mailData.email)
            .from(Env.get('EMAIL_FROM'))
            .subject(
              caregiver.user.preferred_communication_language ===
                constantMsgs.chinese
                ? '更改預約'
                : 'Change of Appointment',
            );
        },
      );
    } catch (error) {
      Logger.info('Service sendDateChangeMail Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: cron job for the system 6 hours before the booking
   * Params: N/A
   * */
  async cronForWhatsappMsg6Hours() {
    try {
      const bookingData = await Booking.query()
        .with('client')
        .with('caregiverDetail')
        .with('caregiverDetail.caregiver')
        .with('caregiverDetail.caregiver.user')
        .whereRaw('(TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP(), start_time)) = 6')
        .whereNull('cancelled_by')
        .where('caregiver_bookings.status', constantMsgs.awaiting)
        .fetch();

      let notRespondedBookings = [];
      bookingData.toJSON().map((e, i) => {
        notRespondedBookings.push(e);
        e.caregiverDetail.map((cd, j) => {
          if (cd.is_cancelled !== constantMsgs.isCancelled) {
            if (cd.status !== constantMsgs.accepted) {
              if (cd.status === constantMsgs.rejected) {
                delete notRespondedBookings[i].caregiverDetail[j];
              }
            } else {
              delete notRespondedBookings[i];
            }
            return cd;
          }
        });
        return e;
      });
      notRespondedBookings = notRespondedBookings.filter(e => e);

      const results = [];
      for (const nrb of notRespondedBookings) {
        for (const nrbd of nrb.caregiverDetail) {
          if (nrbd && !nrbd.caregiver.user.is_deleted) {
            results.push(
              // sending Mail to Caregiver
              Mail.send(
                'email.ch.booking-reminder-6-hr-caregiver',
                {},
                mail => {
                  mail
                    .to(nrbd.caregiver.user.email)
                    .from(Env.get('EMAIL_FROM'))
                    .subject('Reminder - Pure Care');
                },
              ),
            );
            results.push(
              // sending whatsapp message to CAREGIVER
              util.sendWhatsAppMessage(
                nrbd.caregiver.user.mobile_number,
                '服務喺6小時後開始喇! \n\n麻煩你睇吓電郵（包括垃圾郵件夾）話俾Pure Care知你確認/婉拒今次嘅上門護理服務啦!',
              ),
            );
          }
        }
      }
      if (results && results.length) {
        await Promise.all(results);
      }
    } catch (error) {
      Logger.info('Service cronForWhatsappMsg Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: cron job for the system 2 hours before the booking
   * Params: N/A
   * */
  async cronForWhatsappMsg2Hours() {
    try {
      const bookingData = await Booking.query()
        .with('client')
        .with('client.user')
        .with('caregiverDetail')
        .with('caregiverDetail.caregiver')
        .with('caregiverDetail.caregiver.user')
        .whereRaw('(TIMESTAMPDIFF(HOUR, CURRENT_TIMESTAMP(), start_time)) = 2')
        .whereNull('cancelled_by')
        .where('caregiver_bookings.status', constantMsgs.awaiting)
        .fetch();

      let notRespondedBookings = [];
      bookingData.toJSON().map((e, i) => {
        notRespondedBookings.push(e);
        e.caregiverDetail.map((cd, j) => {
          if (cd.is_cancelled !== constantMsgs.isCancelled) {
            if (cd.status !== constantMsgs.accepted) {
              if (cd.status === constantMsgs.rejected) {
                delete notRespondedBookings[i].caregiverDetail[j];
              }
            } else {
              delete notRespondedBookings[i];
            }
            return cd;
          }
        });
        return e;
      });
      notRespondedBookings = notRespondedBookings.filter(e => e);
      // cancel booking automatically
      const notRespondedBookingsIds = notRespondedBookings.map(e => e.id);
      if (notRespondedBookingsIds && notRespondedBookingsIds.length) {
        await Booking.query()
          .whereIn('id', notRespondedBookingsIds)
          .update({ status: constantMsgs.cancelled, cancelled_by: '1' });
      }

      const results = [];
      for (const nrb of notRespondedBookings) {
        let sendClient = false;
        for (const nrbd of nrb.caregiverDetail) {
          if (nrbd && !nrbd.caregiver.user.is_deleted) {
            results.push(
              // sending Mail to Caregiver
              Mail.send(
                'email.ch.booking-reminder-2-hr-caregiver',
                {},
                mail => {
                  mail
                    .to(nrbd.caregiver.user.email)
                    .from(Env.get('EMAIL_FROM'))
                    .subject('Reminder - Pure Care');
                },
              ),
            );
            results.push(
              // sending whatsapp message to CAREGIVER
              util.sendWhatsAppMessage(
                nrbd.caregiver.user.mobile_number,
                '由於未有護理員確認今次嘅上門服務，好抱歉今次嘅預約將會取消。',
              ),
            );
            sendClient = true;
          }
        }
        if (sendClient && !nrb.client.user.is_deleted) {
          results.push(
            // sending Mail to CLIENT
            Mail.send('email.ch.booking-reminder-2-hr-client', {}, mail => {
              mail
                .to(nrb.client.user.email)
                .from(Env.get('EMAIL_FROM'))
                .subject('Reminder - Pure Care');
            }),
          );
          results.push(
            // sending whatsapp message to CLIENT
            util.sendWhatsAppMessage(
              nrb.client.user.mobile_number,
              '唔好意思，今次未有護理員能夠提供上門服務! 麻煩你再次到訪www.purecare.com.hk選擇合適嘅護理員。',
            ),
          );
        }
      }
      if (results && results.length) {
        await Promise.all(results);
      }
    } catch (error) {
      Logger.info('Service cronForWhatsappMsg Catch %s', error);
      throw error;
    }
  }

  /**
   * Name: Jainam Shah
   * Purpose: cron job for the system for completion of booking
   * Params: N/A
   * */
  async cronForFeedbackForm() {
    try {
      const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
      const gapHour = moment(currentTime)
        .subtract('30', 'minutes')
        .format('YYYY-MM-DD HH:mm:ss');

      let bookingData = await Booking.query()
        .with('caregiverDetail')
        .with('client')
        .with('client.user')
        .where('end_time', '>', gapHour)
        .where('end_time', '<', currentTime)
        .whereNull('cancelled_by')
        .where('caregiver_bookings.status', constantMsgs.accepted)
        .fetch();

      const results = [];
      bookingData = bookingData.toJSON();
      for (const data of bookingData) {
        const { 0: checkAccepted } = data.caregiverDetail.filter(
          c => c.status === constantMsgs.accepted,
        );
        const caregiver = await Caregiver.find(checkAccepted.caregiver_id);
        caregiver.total_completion_event += 1;
        await caregiver.save();
        const booking = await Booking.find(data.id);
        booking.completion_count = caregiver.total_completion_event;
        await booking.save();

        const mailData = {
          clientEmail: data.client.user.email,
          name: data.client.first_name,
          // link: `${Env.get('FEEDBACK_FORM_CLIENT')}?booking=${data.booking_id}`,
        };

        const tokenData = {
          booking_id: data.booking_id,
          slug: data.client.slug,
        };
        let encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(tokenData),
          `${Env.get('APP_KEY', 'D6B13YMGZ8zLKWZb51yh9hC2lXIWZtx8')}`,
        ).toString();
        encryptedData = CryptoJS.enc.Base64.parse(encryptedData);
        encryptedData = encryptedData.toString(CryptoJS.enc.Hex);
        mailData.link = `${Env.get(
          'FEEDBACK_FORM_CLIENT',
        )}?booking=${encryptedData}`;

        if (!data.client.user.is_deleted) {
          // mail for client
          await Mail.send(
            data.client.user.preferred_communication_language ===
              constantMsgs.chinese
              ? 'email.ch.feedback-form-client'
              : 'email.en.feedback-form-client',
            mailData,
            mail => {
              mail
                .to(mailData.clientEmail)
                .from(Env.get('EMAIL_FROM'))
                .subject('用户意見 Feedback Form');
            },
          );

          results.push(
            // sending whatsapp message to CLIENT for feedback form
            util.sendWhatsAppMessage(
              data.client.user.mobile_number,
              `啱啱護理員服務好嗎?麻煩你用1分鐘同大家分享你嘅想法!\n${mailData.link}`,
            ),
          );
        }
      }
      if (results && results.length) {
        await Promise.all(results);
      }
    } catch (error) {
      Logger.info('Service cronForWhatsappMsg Catch %s', error);
      throw error;
    }
  }
}

module.exports = BookingService;
