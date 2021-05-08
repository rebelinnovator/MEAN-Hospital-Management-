'use strict';

// Libraries
const path = require('path');

// Services
const message = require(path.resolve('app/Constants/Response/index'));
const appointmentservice = make('App/Services/Appointment/AppointmentService');

// Constants
const util = make('App/Services/Common/UtilService');

class AppointmentController {
  async getOutstandingAppointments({ request, response }) {
    try {
      const reqData = await request.all();

      const appointmentdata = await appointmentservice.getOutstandingAppointments(
        reqData,
      );

      const data = util.createPagination(
        appointmentdata.count,
        appointmentdata.pageNumber,
        appointmentdata.recordPerPage,
        appointmentdata.appointment,
      );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }

  async getCompletedAppointments({ request, response }) {
    try {
      const reqData = await request.all();

      const appointmentdata = await appointmentservice.getCompletedAppointments(
        reqData,
      );

      const data = reqData.requiredCSV
        ? appointmentdata
        : util.createPagination(
            appointmentdata.count,
            appointmentdata.pageNumber,
            appointmentdata.recordPerPage,
            appointmentdata.appointment,
          );
      return util.sendSuccessResponse(response, {
        success: true,
        ...message.SUCCESS,
        data,
      });
    } catch (error) {
      return util.sendErrorResponse(response, { data: error });
    }
  }
}
module.exports = AppointmentController;
