'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => 'Pure Care API');

// Auth
Route.group(() => {
  Route.post('register', 'Auth/AuthController.Register').validator(
    'Auth/Register',
  );

  Route.post('register-by-admin', 'Auth/AuthController.RegisterByAdmin')
    .validator('Auth/Register')
    .middleware(['CheckFingerPrint', 'auth', 'isAdmin']);

  Route.post('login', 'Auth/AuthController.login').validator('Auth/Login');
  Route.put('confirm-email', 'Auth/AuthController.confirmEmail').validator(
    'Auth/ConfirmEmail',
  );

  Route.post(
    'resend-confirm-email',
    'Auth/AuthController.resendConfirmEmail',
  ).validator('Auth/ForgotPassword');

  Route.post(
    'forgot-password',
    'Auth/PasswordController.forgotPassword',
  ).validator('Auth/ForgotPassword');

  Route.post(
    'resend-forgot-password',
    'Auth/PasswordController.forgotPassword',
  ).validator('Auth/ForgotPassword');

  Route.put(
    'reset-password',
    'Auth/PasswordController.resetPassword',
  ).validator('Auth/ResetPassword');
})
  .prefix('api/auth')
  .middleware(['IPLogger', 'throttle:5', 'Encryptor']);

Route.group(() => {
  Route.get('location', 'Location/LocationController.getLocations');
  Route.get('skill-set', 'SkillSet/SkillSetController.getSkillSet').validator(
    'SkillSet/GetSkillSet',
  );
  Route.get('illness', 'Illness/IllnessController.getIllnesses');
  Route.get(
    'self-care-abilitties',
    'SelfCareAbility/SelfCareAbilityController.getSelfCareAbility',
  );
  Route.post(
    'search-caregivers',
    'Caregiver/CaregiverController.searchCaregiver',
  ).validator('Caregiver/SearchCaregiver');
  Route.get(
    'setting',
    'SystemSetting/SystemSettingController.getSystemSettings',
  );
})
  .prefix('api')
  .middleware('IPLogger');

Route.group(() => {
  // get all caregivers, clients
  Route.get(
    'caregivers',
    'Caregiver/CaregiverController.getAllCaregivers',
  ).validator('Admin/GetAllCaregivers');
  Route.get('clients', 'Client/ClientController.getAllClients').validator(
    'Admin/GetAllClients',
  );

  Route.put(
    'change-status',
    'Caregiver/CaregiverController.changeStatus',
  ).validator('Admin/ChangeCaregiverStatus');

  Route.put('delete-user', 'User/UserController.deleteUser').validator(
    'Admin/DeleteUser',
  );

  // Feedbacks
  Route.delete(
    'remove-feedback',
    'ClientFeedback/ClientFeedbackController.removeFeedback',
  ).validator('Admin/RemoveFeedback');

  // Appointments
  Route.get(
    'outstanding-appointments',
    'Appointment/AppointmentController.getOutstandingAppointments',
  ).validator('Admin/OutstandingAppointment');
  Route.get(
    'completed-appointments',
    'Appointment/AppointmentController.getCompletedAppointments',
  ).validator('Admin/OutstandingAppointment');

  // System Settings
  Route.post(
    'setting',
    'SystemSetting/SystemSettingController.updateSystemSettings',
  ).validator('Admin/UpdateSysSettings');

  // Pay Referral Amount
  Route.post(
    'pay-referral-amount',
    'User/UserController.payReferralAmount',
  ).validator('Admin/PayReferralBonus');
})
  .prefix('api')
  .middleware(['IPLogger', 'CheckFingerPrint', 'auth', 'isAdmin']);

// Profile Section
Route.group(() => {
  Route.get(
    'overview',
    'Caregiver/CaregiverController.getProfileOverview',
  ).validator('Caregiver/CheckRegNo');
  Route.get('info', 'Caregiver/CaregiverController.getProfileInfo').validator(
    'Caregiver/CheckRegNo',
  );
  Route.get(
    'reviews',
    'Caregiver/CaregiverController.getAllFeedbacks',
  ).validator('Caregiver/CheckRegNo');
  Route.get(
    'availability',
    'Caregiver/OnboardingSteps/AvailabilityController.getAvailability',
  )
    .validator('Caregiver/CheckRegNo')
    .middleware(['CheckCaregiver']);
  Route.put('change-password', 'Auth/PasswordController.changePassword')
    .validator('Auth/ChangePassword')
    .middleware(['CheckFingerPrint', 'auth']);
})
  .prefix('api/caregiver/profile')
  .middleware(['IPLogger']);

// Caregiver
Route.group(() => {
  // Personal Info
  Route.get(
    'personal-info',
    'Caregiver/OnboardingSteps/PersonalInfoController.getPersonalInfo',
  ).validator('Caregiver/CheckRegNo');

  Route.post(
    'personal-info',
    'Caregiver/OnboardingSteps/PersonalInfoController.addPersonalInfo',
  ).validator('Caregiver/PersonalInfo');

  // experience-education
  Route.get(
    'experience-education',
    'Caregiver/OnboardingSteps/ExperienceEducationController.getExperienceEducation',
  ).validator('Caregiver/CheckRegNo');

  Route.post(
    'experience-education',
    'Caregiver/OnboardingSteps/ExperienceEducationController.addUpdateExperienceEducation',
  ).validator('Caregiver/AddUpdateExperienceEducation');

  Route.put(
    'update-show-employer-status',
    'Caregiver/OnboardingSteps/ExperienceEducationController.updateShowEmployerStatus',
  ).validator('Caregiver/UpdateShowEmployerStatus');

  // SkillSet
  Route.get(
    'skill-set',
    'Caregiver/OnboardingSteps/SkillSetController.getCaregiverSkillSet',
  ).validator('Caregiver/CheckRegNo');

  Route.post(
    'skill-set',
    'Caregiver/OnboardingSteps/SkillSetController.addCaregiverSkillSet',
  ).validator('Caregiver/AddUpdateSkillSet');

  // Availibility
  Route.get(
    'availability',
    'Caregiver/OnboardingSteps/AvailabilityController.getAvailability',
  ).validator('Caregiver/CheckRegNo');

  Route.post(
    'availability',
    'Caregiver/OnboardingSteps/AvailabilityController.addUpdateAvailability',
  ).validator('Caregiver/AddUpdateAvailability');

  // Charges
  Route.get(
    'charges',
    'Caregiver/OnboardingSteps/ChargesController.getChargesData',
  ).validator('Caregiver/CheckRegNo');
  Route.post(
    'charges',
    'Caregiver/OnboardingSteps/ChargesController.addUpdateCharges',
  ).validator('Caregiver/AddUpdateCharges');

  // Terms & Conditions
  Route.post(
    'terms-conditions',
    'Caregiver/OnboardingSteps/TermsAndConditionsController.sendTermsAndConditionsMail',
  ).validator('Caregiver/TermsAndConditions');

  // Referral Bonus
  Route.get('referral-bonus', 'User/UserController.getReferralBonus').validator(
    'User/GetReferralBonus',
  );
})
  .prefix('api/caregiver')
  .middleware(['IPLogger', 'CheckFingerPrint', 'auth', 'CaregiverOrAdmin']);

// Client
Route.group(() => {
  // Account User Info
  Route.get(
    'account-user-info',
    'Client/OnboardingSteps/AccountUserInfoController.getAccountUserInfo',
  ).validator('User/CheckUser');
  Route.post(
    'account-user-info',
    'Client/OnboardingSteps/AccountUserInfoController.addAccountUserInfo',
  ).validator('Client/AddUpdateAccountUserInfo');

  // Service User Info
  Route.get(
    'service-user-info',
    'Client/OnboardingSteps/ServiceUserInfoController.getServiceUserInfo',
  ).validator('Client/CheckSlug');
  Route.post(
    'service-user-info',
    'Client/OnboardingSteps/ServiceUserInfoController.addServiceUserInfo',
  ).validator('Client/AddUpdateServiceUserInfo');

  // Service User Background
  Route.get(
    'service-user-background',
    'Client/OnboardingSteps/ServiceUserBackgroundController.getServiceUserBackground',
  ).validator('Client/CheckSlug');
  Route.post(
    'service-user-background',
    'Client/OnboardingSteps/ServiceUserBackgroundController.addUpdateServiceUserBackground',
  ).validator('Client/AddUpdateServiceUserBackground');

  // Service User medical history
  Route.get(
    'service-user-medical-history',
    'Client/OnboardingSteps/ServiceUserMedHistoryController.getServiceUserMedHistory',
  ).validator('Client/CheckSlug');
  Route.post(
    'service-user-medical-history',
    'Client/OnboardingSteps/ServiceUserMedHistoryController.addServiceUserMedHistory',
  ).validator('Client/AddUpdateServiceUserMedHistory');

  // Terms & Conditions
  Route.get(
    'terms-conditions',
    'Client/OnboardingSteps/TermsAndConditionsController.getClientTncInfo',
  ).validator('Client/CheckSlug');
  Route.post(
    'terms-conditions',
    'Client/OnboardingSteps/TermsAndConditionsController.sendTermsAndConditionsMail',
  ).validator('Client/TermsAndConditions');

  // Referral Bonus
  Route.get('referral-bonus', 'User/UserController.getReferralBonus').validator(
    'User/GetReferralBonus',
  );

  // // Give Feedback
  // Route.post(
  //   'feedback',
  //   'ClientFeedback/ClientFeedbackController.addFeedback',
  // ).validator('Client/AddClientFeedback');

  // Change Password
  Route.put(
    'profile/change-password',
    'Auth/PasswordController.changePassword',
  ).validator('Auth/ChangePassword');
})
  .prefix('api/client')
  .middleware(['IPLogger', 'CheckFingerPrint', 'auth', 'ClientOrAdmin']);

// Booking
Route.group(() => {
  // Get Booking For Clinet
  Route.get('for-client', 'Booking/BookingController.getBookingForClient')
    .middleware(['ClientOrAdmin'])
    .validator('Booking/GetBookingForClient');

  // Get Booking For Caregiver
  Route.get('for-caregiver', 'Booking/BookingController.getBookingForCaregiver')
    .middleware(['isAdmin'])
    .validator('Booking/GetBookingForCaregiver');

  // Add Booking
  Route.post('', 'Booking/BookingController.addBooking')
    .middleware(['isClient'])
    .validator('Booking/AddBooking');

  // Booking Action
  // // Accept Booking by Caregiver
  // Route.post('accept', 'Booking/BookingActionController.acceptBooking')
  //   .middleware(['isCaregiver'])
  //   .validator('Booking/BookingActionByCaregiver');

  // // Reject Booking by Caregiver
  // Route.post('reject', 'Booking/BookingActionController.rejectBooking')
  //   .middleware(['isCaregiver'])
  //   .validator('Booking/BookingActionByCaregiver');

  // confirm booking by Admin
  Route.post('confirm', 'Booking/BookingActionController.confirmBooking')
    .middleware(['isAdmin'])
    .validator('Booking/BookingActionByAdmin');

  // cancel booking by Client
  Route.put(
    'cancel-by-client',
    'Booking/BookingActionController.cancelBookingByClient',
  )
    .middleware(['ClientOrAdmin'])
    .validator('Booking/CancelBookingByClient');

  // cancel booking by Caregiver
  Route.put(
    'cancel-by-caregiver',
    'Booking/BookingActionController.cancelBookingByCaregiver',
  )
    .middleware(['isCaregiver'])
    .validator('Booking/CancelBookingByCaregiver');

  // cancel booking by Admin
  Route.put(
    'cancel-by-admin',
    'Booking/BookingActionController.cancelBookingByAdmin',
  )
    .middleware(['isAdmin'])
    .validator('Booking/CancelBookingByAdmin');

  // Caregiver payment by Admin
  Route.put('caregiver-payment', 'Booking/BookingController.caregiverPayment')
    .middleware(['isAdmin'])
    .validator('Admin/CaregiverPayment');

  // Change booking Date/StartTime by Admin
  Route.put(
    'change-booking-time',
    'Booking/BookingActionController.changeBookingTime',
  )
    .middleware(['isAdmin'])
    .validator('Admin/ChangeBookingTime');

  // Get Open Booking For Client
  Route.get(
    'client-open-bookings',
    'Booking/BookingController.getOpenClientBookings',
  )
    .middleware(['isClient'])
    .validator('Client/CheckSlug');

  // Booking Details
  Route.get('details', 'Booking/BookingController.getBookingDetails')
    .middleware(['isAdmin'])
    .validator('Booking/CancelBookingByAdmin');
})
  .prefix('api/booking')
  .middleware(['IPLogger', 'CheckFingerPrint', 'auth']);

// Change Password Admin profile
Route.put(
  'api/profile/change-password',
  'Auth/PasswordController.changePassword',
)
  .middleware(['IPLogger', 'CheckFingerPrint', 'auth', 'isAdmin'])
  .validator('Auth/ChangePassword');

// Booking Action without login Accept/Reject by Caregiver, Give feedback by client
Route.group(() => {
  // Give Feedback
  Route.post(
    'client/feedback',
    'ClientFeedback/ClientFeedbackController.addFeedback',
  ).validator('Client/AddClientFeedback');

  // Accept Booking by Caregiver
  Route.post(
    'booking/accept',
    'Booking/BookingActionController.acceptBooking',
  ).validator('Booking/BookingActionByCaregiver');

  // Reject Booking by Caregiver
  Route.post(
    'booking/reject',
    'Booking/BookingActionController.rejectBooking',
  ).validator('Booking/BookingActionByCaregiver');
})
  .prefix('api')
  .middleware(['IPLogger', 'BookingActionHandler']);
