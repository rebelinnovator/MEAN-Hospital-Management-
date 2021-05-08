'use strict';

/**
 * Module dependencies
 */
const _ = require('lodash');

/**
 * Extend Response messages
 */
module.exports = _.extend(
  require('./Common'),
  require('./Auth'),
  require('./Caregiver'),
  require('./Client'),
  require('./Booking'),
  require('./Enum'),
  require('./EnumChinese'),
);
