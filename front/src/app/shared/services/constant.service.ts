import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ConstantService {
  regex = {
    digit_2: new RegExp(/[0-9]{2}/),
    digit_4: new RegExp(/[0-9]{4}/),
  }
  MESSAGES_TYPE = {
    APP_RECEIVED: 'Application Received Message',
    STATUS: 'Status Message',
    COMPLETION: 'Service Completed Message',
  }
  WARN = 'Warning!'
  SUCCESS = 'Success!'
  ERROR = 'Error!'
  INFO = 'Info!'
  NOT_FOUND = 'Result not found!'
  NOT_ALLOWED = 'Not allowed to access!'
  NOT_EMPTY = 'Feild should not be empty!'
  NAME_REQUIRED = 'Name is required.'
  FEILD_REQUIRED = 'Field is required.'
  INVALID_ADDRESS =
    'Unfortunately, this address wasn\'t found. Please double-check it and try again.'
  MAX_LENGTH_150 = 'Length must be less then or equal to 150.'
  MAX_LENGTH = 'Length must be less then or equal to'
  VALID_EMAIL = 'Must be valid email.'
  AC_REQUIRED = 'Access code must be at least 6 characters long.'
  UPDATE_SUCCESS = 'Updated Successfully.'
  ALL_NUM_REQUIRED = 'All boxes numeric required.'
  SERVICE_ID_REQUIRED = 'Service ID must be 10 characters long.'
  GREATER_THAN = 'Start Date of First PP  cannot be less than the Service Loaded Date.'
  RESET_FORM = 'Please save changes before switching to other service otherwise all changs will be discarded.'
  MAX_10_PP = 'Service must contain not more than 10 PPs.'
  SINGLE_HOUR_INPUT = 'Please write input for single hour rate'
  ALL_HOUR_INPUT = 'Please input all hourly rates'
  SELECT_PAYMENT_METHOD = 'Please select a payment method'
  SELECT_SKILL_ONE = 'Please select a payment method'
  ENTER_START_TIME = 'Please enter Start Time'
  MAXIMUM_SERVICE = 'Maximum service allowed for 12 hours only.'
  END_TIME_LARGER = 'End time should be larger than From time'
  TRANSPORT = 'Please enter Transport subsidy amount'
  SELECT_SERVICES = 'Please select services to book caregiver'
  SELECT_DATE = 'Please select date to book caregiver'
  SELECT_START_END = 'Please select Start and End time to book caregiver'
  FROM_TIME = 'From time should be smaller than To Time'
  MAX_CAREGVIER = 'Please select up to 3 Caregivers'
  COMPLETE_ONBOARD = 'Please complete onboarding steps to book caregiver'
  LOGIN_TO_BOOK = 'Please login to book caregiver'
  CHOOSE_RATING = 'Please choose rating'
  SELECT_ONE_LANGUAGE = 'Please select at least 1 language'
  SELECT_ONE_SELFCARE = 'Please select at least 1 self-care ability'
  SOMETHING = 'Something went wrong, Please try again.'
  LOGIN_TO_CONTINUE = 'Please Login to continue.'
  SPECIFY_CANCER = 'Please specify your cancer.'
  SPECIFY_FRAC = 'Please specify your fracture.'
  SPECIFY_ONE_FRAC = 'Please select atleast one option from fracture.'
  SPECIFY_ONE_HEPA = 'Please select atleast one option from hepatitis.'
  MAX_LOCATIONS = 'Maximum 5 locations are allowed.'
  ATLEAST_ONE_LOCATION = 'Please select at least one location.'
  NO_INTERNET = 'Please check your internet connection.'
  INTERNET_CONNECTED = 'Connected to internet! You are online'
  HOURS_ERROR = 'Please enter time between 1 to 12'
  OTHER_CAREGIVER_BOOKING = 'Seems like other caregiver has logged in , please logout and login with your details for accepting the booking.'
  SIX_HOURS = 'In order to help the caregiver get prepared, please book at least 6 hours before the service starts!'
  PER_PAGE_RECORD = 10;
  INITIAL_PAGE_NUMBER = 1;
  ITERATION_NUMBER_EXPERIENCE_YEARS = 20;
  IS_CURRENT_EMPLOYER = '1';
  START_END_REQUIRED = 'Please enter start and end time';
  TRANSPORT_SUBSIDY_ERROR = 'Please enter transport subsidy amount between 1 and 500';
  DELETED_CAREGIVER = 'This user is no longer available in the system';
  GREATER_DAY = 'Please select To Day value greter then From Day value';
  SELECT_FUTURE = 'Please select future date and time to book caregiver.';
  CANNOT_ACCEPT = 'Please select any one payment method.';
  SELECT_ONE_SKILL = 'Please select atleast one skill.';
  DATA_OVERLAPPING = 'Work experience is overlapping.';
  FROM_DATE_SMALLER = 'From date should be Smaller then To Date';
  SELECT_FROM_TO = 'Please select From & To Dates';
  FROM_YEAR_SMALLER = 'From Year should be Smaller then To Year';
  SELECT_BOTH_YEARS = 'Please select From & To Years';
  SELECT_MONTH_YEAR = 'Please select Month & Year';
  SELECT_PROPER_DATES = 'Please select proper dates';
  FILL_ALL = 'Please Fill all the fileds';
  HOSPITAL_NAME = 'Name of Hospital/Company is required';
  WORK_TYPE = 'Work Type is required';
  MONTH_REQUIRED = 'Month is required';
  YEAR_REQUIRED = 'Year is required';
  HOURLY_DIFFERENCE_SEARCH = 'Please book appointment on an hourly basis.';
  SELECT_CAREGIVER_TYPE = 'Please select Caregiver type';
  constructor() { }
}
