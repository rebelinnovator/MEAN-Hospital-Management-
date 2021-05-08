'use strict';

const util = make('App/Services/Common/UtilService');
const { rule } = use('Validator');

class AddUpdateExperienceEducation {
  get validateAll() {
    return true;
  }

  get sanitizationRules() {
    return {
      'registration_no': 'to_int',
      'show_employer_option': 'escape',
      'employer.*.work_type': 'escape',
      'employer.*.name': 'escape',
      'education.*.institute_name': 'escape',
      'education.*.degree': 'escape',
    };
  }

  get rules() {
    return {
      'registration_no': 'required',
      'caregiver_type': [
        rule('required'),
        rule('in', ['1', '2', '3', '4', '5']),
      ],
      'licence_expiry_date': [
        rule('required_when', ['caregiver_type', '1']),
        rule('required_when', ['caregiver_type', '2']),
        rule('date'),
      ],
      'show_employer_option': 'required',

      'employer': 'array',
      'employer.*.name': 'required',
      'employer.*.work_type': 'required',
      'employer.*.from_month': 'required|number',
      'employer.*.from_year': 'required|number',
      'employer.*.to_month': [
        // rule('required_without_all', ['employer.*.is_current_employer']),
        rule('number'),
      ],
      'employer.*.to_year': [
        // rule('required_without_all', ['employer.*.is_current_employer']),
        rule('number'),
      ],
      'employer.*.is_current_employer': 'number',
      'deleted_employer': 'array',

      'education': 'array',
      'education.*.institute_name': 'required|string',
      'education.*.degree': 'required|string',
      'education.*.start_year': 'required|number',
      'education.*.end_year': 'required|number',
      'deleted_education': 'array',
    };
  }

  get messages() {
    return {
      'registration_no.required': 'Caregiver is required.',
      'caregiver_type.required': 'Caregiver type is required.',
      'caregiver_type.in': 'Caregiver type should be in 1 to 5.',

      'employer.array': 'Employer should be an array.',
      'employer.*.name': 'Name is required.',
      'employer.*.work_type.required': 'Work type is required.',
      'employer.*.from_month.required': 'From month is required.',
      'employer.*.from_year.required': 'From year is required.',
      'employer.*.to_month.required': 'To month is required.',
      'employer.*.to_year.required': 'To year is required.',
      'deleted_employer.array': 'Deleted Employer should be an array.',

      'education.array': 'Education should be an array.',
      'education.*.institute_name.required': 'Institute name is required.',
      'education.*.degree.required': 'Degree is required.',
      'education.*.start_year.required': 'Start year is required.',
      'education.*.end_year.required': 'End year is required.',
      'deleted_education.array': 'Deleted Education should be an array.',
    };
  }

  async fails(errorMessages) {
    return util.handleBadRequest(errorMessages);
  }
}

module.exports = AddUpdateExperienceEducation;
