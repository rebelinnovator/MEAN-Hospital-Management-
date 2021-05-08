'use strict';

const Logger = use('Logger');

class IPLogger {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    const ip = request.ip();
    const method = request.method();

    Logger.info(
      `Time: ${new Date()}, IP: ${ip} > [${method}] ${request.header(
        'Host',
      )}${request.originalUrl()}`,
    );

    await next();
  }
}

module.exports = IPLogger;
