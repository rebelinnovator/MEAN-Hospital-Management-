// Models
const Client = use('App/Models/Client');

class ClientService {
  /**
   * Name: Nirav Goswami
   * Purpose: To check if client is exists or not
   * Params: slug
   * */
  async checkClientBySlug(slug) {
    return Client.findBy('slug', slug);
  }

  // ----------------------- Admin side-------------------------
  async getAllClients(reqData) {
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

      const qb = Client.query();

      qb.select(
        'clients.id',
        'user_id',
        'first_name',
        'last_name',
        'clients.created_at',
      );

      qb.with('caregiverBooking', caregiverBookingQuery => {
        caregiverBookingQuery.select(
          'id',
          'client_id',
          'duration',
          'cancelled_by',
          'status',
          'payment_status',
        );
        caregiverBookingQuery.with('caregiverDetail', caregiverDetailQuery => {
          caregiverDetailQuery.select(
            'id',
            'caregiver_booking_id',
            'client_service_fee',
          );
        });
      });

      // Relations
      qb.with('user', userQuery => {
        userQuery.select(
          'id',
          'mobile_number',
          'email',
          'status',
          'due_amount',
          'total_service_fee',
          'is_deleted',
        );
      });

      qb.withCount('bookings');

      qb.whereHas('user', userBuilder => {
        userBuilder.where('is_deleted', '=', 0);
      });

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

      if (reqData.isRefferalFeeDue == 'true') {
        qb.whereHas('user', userBuilder => {
          userBuilder.where('due_amount', '>', 0);
        });
      }

      if (orderBy == 'bookings') {
        qb.orderBy('bookings_count', orderDir);
      } else if (orderBy == 'due_amount') {
        qb.leftJoin('users as usr', 'usr.id', 'clients.user_id');
        qb.orderBy('usr.due_amount', orderDir);
      } else if (orderBy == 'total_service_fee') {
        qb.leftJoin('users as usr', 'usr.id', 'clients.user_id');
        qb.orderBy('usr.total_service_fee', orderDir);
      } else {
        qb.orderBy(orderBy, orderDir);
      }

      const count = await qb.getCount();

      // Pagination
      qb.limit(recordPerPage);
      qb.offset(offset);

      const clients = await qb.fetch();

      return { clients, count, recordPerPage, pageNumber };
      // }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClientService;
