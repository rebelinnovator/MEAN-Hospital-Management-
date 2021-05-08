/**
 *
 *
 * @class ErrorHandler
 * @extends {Error}
 */
class ErrorHandler extends Error {
  constructor(statusCode, message, data) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
module.exports = ErrorHandler;
