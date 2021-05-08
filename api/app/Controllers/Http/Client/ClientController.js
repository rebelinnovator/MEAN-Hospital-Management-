'use strict';

// Libraries
const path = require('path');

// Services
const message = require(path.resolve('app/Constants/Response/index'));
const clientService = make('App/Services/Client/ClientService');

// Constants
const util = make('App/Services/Common/UtilService');

class ClientController {
  // ---------------------------admin side--------------------------------------------
  async getAllClients({ request, response }) {
    try {
      const reqData = await request.all();

      // get all caregivers
      const clientsData = await clientService.getAllClients(reqData);
      const data = util.createPagination(
        clientsData.count,
        clientsData.pageNumber,
        clientsData.recordPerPage,
        clientsData.clients,
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

module.exports = ClientController;
