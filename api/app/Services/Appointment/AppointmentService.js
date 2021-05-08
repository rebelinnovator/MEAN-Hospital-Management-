// Models
const CaregiverBooking = use('App/Models/CaregiverBooking');

// outstanding matches
const caregiverBookingSelectData = [
  'id',
  'booking_id',
  'client_id',
  'date',
  'start_time',
  'end_time',
  'status',
  'duration',
  'transport_subsidy',
  'payment_status',
];
const caregiverBookingDetailsSelect = [
  'id',
  'caregiver_booking_id',
  'caregiver_id',
  'status',
  'total_amount',
  'caregiver_charges_price',
  'client_service_fee',
  'caregiver_service_fee',
];
const clientSelectData = [
  'id',
  'user_id',
  'first_name',
  'last_name',
  'home_telephone_number',
  'relation_with_service_user',
  'service_user_salute',
  'service_user_dob',
  'service_user_firstname',
  'service_user_lastname',
  'service_user_flat_no',
  'service_user_floor_no',
  'service_user_building_name',
  'service_user_street_name_number',
  'service_user_district',
];

// completed matches
const bookingCompletedSelect = [
  'caregiver_bookings.id',
  'booking_id',
  'client_id',
  'date',
  'start_time',
  'end_time',
  'duration',
  'transport_subsidy',
  'caregiver_bookings.status',
  'payment_status',
  'receipt_number',
  'payment_status_caregiver',
];
const clientSelect = [
  'id',
  'user_id',
  'first_name',
  'last_name',
  'home_telephone_number',
  'service_user_mobile',
  'relation_with_service_user',
  'service_user_salute',
  'service_user_dob',
  'service_user_firstname',
  'service_user_lastname',
  'service_user_flat_no',
  'service_user_floor_no',
  'service_user_building_name',
  'service_user_street_name_number',
  'service_user_district',
];
const caregiverDetailSelect = [
  'id',
  'caregiver_booking_id',
  'caregiver_id',
  'total_amount',
  'caregiver_charges_price',
  'client_service_fee',
  'caregiver_service_fee',
  'status',
];

const bookingStatusByMsg = {
  awaiting: '1',
  accepted: '2',
  rejected: '3',
  cancelled: '4',
};

class AppointmentService {
  async getOutstandingAppointments(reqData) {
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

      const qb = CaregiverBooking.query();

      qb.select(caregiverBookingSelectData);

      qb.where('status', '=', bookingStatusByMsg.awaiting);

      if (reqData.start_time && reqData.end_time) {
        qb.whereRaw(
          `CAST(date AS DATE) >= '${reqData.start_time}' && CAST(date AS DATE) <= '${reqData.end_time}'`,
        );
      }

      // Relations
      qb.with('caregiverDetail', caregiverDetailQuery => {
        caregiverDetailQuery.select(caregiverBookingDetailsSelect);
        caregiverDetailQuery.with('caregiver', caregiverQuery => {
          caregiverQuery.select('id', 'registration_no');
        });
      });

      qb.with('services', servicesQuery => {
        servicesQuery.select('id', 'english_title');
      });

      qb.with('client', clientQuery => {
        clientQuery.select(clientSelectData);
        clientQuery.with('user', userQuery => {
          userQuery.select('id', 'mobile_number', 'email');
        });
      });

      if (reqData.isAcceptedByCaregiver == 'one') {
        qb.whereHas('caregiverDetail', caregiverDetailBuilder => {
          caregiverDetailBuilder.where('status', bookingStatusByMsg.accepted);
        });
      }
      if (reqData.isAcceptedByCaregiver == 'none') {
        qb.whereDoesntHave('caregiverDetail', caregiverDetailBuilder => {
          caregiverDetailBuilder.where('status', bookingStatusByMsg.accepted);
        });
      }
      if (reqData.email) {
        qb.whereHas('client.user', userBuilder => {
          userBuilder.where('email', reqData.email);
        });
      }
      if (reqData.mobile_number) {
        qb.whereHas('client.user', userBuilder => {
          userBuilder.where('mobile_number', reqData.mobile_number);
        });
      }

      qb.orderBy(orderBy, orderDir);

      const count = await qb.getCount();

      // Pagination
      qb.limit(recordPerPage);
      qb.offset(offset);

      const appointment = await qb.fetch();

      return { appointment, count, recordPerPage, pageNumber };
    } catch (error) {
      throw error;
    }
  }

  async getCompletedAppointments(reqData) {
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

      const qb = CaregiverBooking.query();

      qb.select(bookingCompletedSelect);
      qb.where('caregiver_bookings.status', '=', bookingStatusByMsg.accepted);

      // Relations
      qb.with('caregiverDetail', caregiverDetailQuery => {
        caregiverDetailQuery.select(caregiverDetailSelect);
        caregiverDetailQuery.with('caregiver', caregiverQuery => {
          caregiverQuery.select(
            'id',
            'user_id',
            'registration_no',
            'english_name',
            'chinese_name',
            'hkid_card_no',
          );
          caregiverQuery.with('user', userQueryBuilder => {
            userQueryBuilder.select(
              'id',
              'mobile_number',
              'preferred_communication_language',
            );
          });
        });
      });

      qb.with('client', clientQuery => {
        clientQuery.select(clientSelect);
        clientQuery.with('user', userQuery => {
          userQuery.select('id', 'mobile_number', 'email');
        });
      });

      if (reqData.payment_status_caregiver) {
        qb.where('payment_status_caregiver', reqData.payment_status_caregiver);
      }
      if (reqData.payment_status) {
        qb.where('payment_status', reqData.payment_status);
      }
      if (reqData.start_time && reqData.end_time) {
        qb.whereRaw(
          `CAST(date AS DATE) >= '${reqData.start_time}' && CAST(date AS DATE) <= '${reqData.end_time}'`,
        );
      }
      if (reqData.caregiver_status) {
        qb.whereHas('caregiverDetail', caregiverDetailBuilder => {
          caregiverDetailBuilder.where('status', reqData.caregiver_status);
        });
      }
      if (reqData.email) {
        qb.whereHas('client.user', userBuilder => {
          userBuilder.where('email', reqData.email);
        });
      }
      if (reqData.mobile_number) {
        qb.whereHas('client.user', userBuilder => {
          userBuilder.where('mobile_number', reqData.mobile_number);
        });
      }
      if (reqData.requiredCSV) {
        const appointment = await qb.fetch();
        return appointment;
      }
      // payment_status_caregiver = paid(2) then sort by amount
      if (reqData.payment_status_caregiver === '2') {
        qb.leftJoin(
          'caregiver_booking_details as cbd',
          'cbd.caregiver_booking_id',
          'caregiver_bookings.id',
        );
        qb.orderBy('cbd.caregiver_charges', orderDir);
      } else {
        qb.orderBy(orderBy, orderDir);
      }

      const count = await qb.getCount();

      // Pagination
      qb.limit(recordPerPage);
      qb.offset(offset);

      const appointment = await qb.fetch();

      return { appointment, count, recordPerPage, pageNumber };
    } catch (error) {
      throw error;
    }
  }
}
module.exports = AppointmentService;
