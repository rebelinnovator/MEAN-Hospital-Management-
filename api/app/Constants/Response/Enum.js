'use strict';

const messages = {
  salutation: ['Mr', 'Ms'],
  service_user_diet: [' Normal', ' Minced', ' Pureed'],
  service_user_eye_sight: [
    ' Normal Eyesight',
    ' Partially visually impaired',
    ' Complete visually impaired',
  ],
  service_user_hearing: [
    ' Normal',
    ' Partially impaired',
    ' Complete impaired',
  ],
  service_user_lifting: [
    ' No Lifting Required',
    ' One Person Lifting Required',
    ' Two People Lifting Required',
    ' Lifting Devices Needed',
  ],
  service_user_language: [' Cantonese', ' Mandarin', ' English', ' Dialect'],
  service_user_background_others: [
    ' Wear Pacemaker',
    ' Hard to swallow',
    ' Incontinence',
    ' Drug Allergy - Please specify',
    ' Violence',
  ],
  service_user_assisting_device: [
    ' Crouches',
    ' Quadripods',
    ' Walker',
    ' Wheel Chair',
    ' Bed_bound',
  ],
  caregiver_type: [
    ' Registered Nurse',
    ' Enrolled Nurse',
    ' Health Worker',
    ' Personal care worker',
    ' Outpatient escort person',
  ],
  location: [
    ' Hong Kong Island',
    ' Central and Western (Hong Kong Island)',
    ' Eastern (Hong Kong Island)',
    ' Southern (Hong Kong Island)',
    ' Wan Chai (Hong Kong Island)',
    ' Kowloon',
    ' Sham Shu Po (Kowloon)',
    ' Kowloon City (Kowloon)',
    ' Kwun Tong (Kowloon)',
    ' Wong Tai Sin (Kowloon)',
    ' Yau Tsim Mong (Kowloon)',
    ' New Territories',
    ' Islands (New Territories)',
    ' Kwai Tsing (New Territories)',
    ' North (New Territories)',
    ' Sai Kung (New Territories)',
    ' Sha Tin (New Territories)',
    ' Tai Po (New Territories)',
    ' Tsuen Wan (New Territories)',
    ' Tuen Mun (New Territories)',
    ' Yuen Long (New Territories)',
  ],

  caregiverStatusType: {
    pending: '1',
    approved: '2',
    unapproved: '3',
  },
};
module.exports = messages;
