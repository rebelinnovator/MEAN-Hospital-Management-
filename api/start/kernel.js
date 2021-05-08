'use strict';

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server');

// cron for booking
const cron = require('node-cron');

const bookingService = make('App/Services/Booking/BookingService');

// run cron on every hour of interval
// e.g. 01:00,02:00
cron.schedule('0 * * * *', async () => {
  console.log('---- cron started cronForWhatsappMsg6Hours----', new Date());
  bookingService.cronForWhatsappMsg6Hours();
  console.log('---- cron ended cronForWhatsappMsg6Hours----');
});

// run cron on every half hour of interval
// e.g. 01:00,01:30
cron.schedule('*/30 * * * *', async () => {
  console.log('---- cron started cronForWhatsappMsg2Hours----', new Date());
  bookingService.cronForWhatsappMsg2Hours();
  console.log('---- cron ended cronForWhatsappMsg2Hours----');
});

// run cron on every half hour and five minute of interval
// e.g. 01:05,02:05
cron.schedule('05 * * * *', async () => {
  console.log('---- cron started cronForFeedbackForm----', new Date());
  bookingService.cronForFeedbackForm();
  console.log('---- cron ended cronForFeedbackForm----');
});
// e.g. 01:35,02:35
cron.schedule('35 * * * *', async () => {
  console.log('---- cron started cronForFeedbackForm----', new Date());
  bookingService.cronForFeedbackForm();
  console.log('---- cron ended cronForFeedbackForm----');
});

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Shield',
];

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly',
  isAdmin: 'App/Middleware/IsAdmin',
  isCaregiver: 'App/Middleware/IsCareGiver',
  isClient: 'App/Middleware/IsClient',
  ClientOrAdmin: 'App/Middleware/ClientOrAdmin',
  CaregiverOrAdmin: 'App/Middleware/CaregiverOrAdmin',
  CheckCaregiver: 'App/Middleware/CheckCaregiver',
  throttle: 'Adonis/Middleware/Throttle',
  CheckFingerPrint: 'App/Middleware/CheckFingerPrint',
  Encryptor: 'App/Middleware/Encryptor',
  BookingActionHandler: 'App/Middleware/BookingActionHandler',
  IPLogger: 'App/Middleware/IPLogger',
};

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = ['Adonis/Middleware/Static', 'Adonis/Middleware/Cors'];

Server.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware);
