'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class AddUpdateServiceUserBackground {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      slug: 'escape',
      service_user_lifting_specific: 'escape',
      other_lang: 'escape',
      specific_drug: 'escape',
    };
  }

  get rules() {
    return {
      'slug': 'required',
      'service_user_weight': 'required|number',
      'service_user_height': 'required|number',
      'service_user_diet': [rule('required'), rule('in', ['1', '2', '3'])],
      'service_user_physical_ability': [
        // rule('required'),
        rule('in', ['0', '1', '2', '3', '4', '5']),
      ],
      'service_user_eye_sight': [rule('required'), rule('in', ['1', '2', '3'])],
      'service_user_hearing': [rule('required'), rule('in', ['1', '2', '3'])],
      'service_user_lifting': [rule('in', ['1', '2', '3', '4'])],
      'service_user_lifting_specific': 'required_when:service_user_lifting,4',
      'service_user_lower_left_leg_limb_mobility': [
        rule('in', ['0', '1', '2', '3', '4', '5']),
      ],
      'service_user_lower_right_leg_limb_mobility': [
        rule('in', ['0', '1', '2', '3', '4', '5']),
      ],
      'service_user_left_hand_mobility': [
        rule('in', ['0', '1', '2', '3', '4', '5']),
      ],
      'service_user_right_hand_mobility': [
        rule('in', ['0', '1', '2', '3', '4', '5']),
      ],
      'service_user_assisting_device': [rule('in', ['1', '2', '3', '4', '5'])],
      'languages': 'array',
      'languages.*.language': 'number',
      'selfCareAbilities': 'array',
      'selfCareAbilities.*': 'number',
      'other_devices': 'array',
      'other_devices.*.other_device': 'number',
    };
  }

  get messages() {
    return {
      'slug.required': 'Slug is required.',
      'service_user_weight.required': 'Weight is required.',
      'service_user_weight.number': 'Weight should be in number.',
      'service_user_height.required': 'Height is required.',
      'service_user_height.number': 'Height should be in number.',
      'service_user_diet.required': 'Diet is required.',
      'service_user_diet.in': 'Diet should be in {{argument}}.',
      'service_user_physical_ability.required': 'Physical Ability is required.',
      'service_user_physical_ability.in':
        'Physical Ability should be in {{argument}}.',
      'service_user_eye_sight.required': 'Eye-sight is required.',
      'service_user_eye_sight.in': 'Eye-sight should be in {{argument}}.',
      'service_user_hearing.required': 'Hearing is required.',
      'service_user_hearing.in': 'Hearing should be in {{argument}}.',
      'service_user_lifting.in': 'Lifting should be in {{argument}}.',
      'service_user_lifting_specific.required_when':
        'Lifting Deivce is required.',
      'service_user_lower_left_leg_limb_mobility.in':
        'Left Leg Mobility should be in {{argument}}.',
      'service_user_lower_right_leg_limb_mobility.in':
        'Right Leg Mobility should be in {{argument}}.',
      'service_user_left_hand_mobility.in':
        'Left Hand Mobility should be in {{argument}}.',
      'service_user_right_hand_mobility.in':
        'Right Hand Mobility should be in {{argument}}.',
      'service_user_assisting_device.in':
        'Assisting Device should be in {{argument}}.',
      'languages.array': 'Languages should be an array.',
      'languages.*.language.number':
        'All values for Languages should be number.',
      'selfCareAbilities.array': 'Selfcare Abilities should be an array.',
      'selfCareAbilities.*.number':
        'All values for selfcare abilities should be number.',
      'other_devices.array': 'Other Devices should be an array.',
      'other_devices.*.other_device.number':
        'All values for other devices should be number.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateServiceUserBackground;
