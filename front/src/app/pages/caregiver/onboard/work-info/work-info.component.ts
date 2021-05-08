import { Component, OnInit, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';
import _ from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { ToastrService } from 'ngx-toastr';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { ApiResponse } from '../../caregiver.interface';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';
@Component({
  selector: 'app-work-info',
  templateUrl: './work-info.component.html',
})
export class WorkInfoComponent implements OnInit {
  workInfoForm: FormGroup;
  isRnEn: boolean = true;
  moment: any = {};
  yearsOfExperience: string = '0';
  monthsOfExperience: string = '0';
  showAnotherPreviousEmployer: boolean = true;
  showAddMoreEducation: boolean = true;
  registeredNumber: string;
  currentCaregiverType: string;
  deletedEmployer: any = [];
  deletedEducation: any = [];
  showRemoveEmployer: boolean = true;
  showRemoveEducation: boolean = false;
  currentStepFromStorage: string;
  monthsArray: any = [
    {
      id: 1,
      name: 'January',
    },
    {
      id: 2,
      name: 'February',
    },
    {
      id: 3,
      name: 'March',
    },
    {
      id: 4,
      name: 'April',
    },
    {
      id: 5,
      name: 'May',
    },
    {
      id: 6,
      name: 'June',
    },
    {
      id: 7,
      name: 'July',
    },
    {
      id: 8,
      name: 'August',
    },
    {
      id: 9,
      name: 'September',
    },
    {
      id: 10,
      name: 'October',
    },
    {
      id: 11,
      name: 'November',
    },
    {
      id: 12,
      name: 'December',
    },
  ];
  years: any = [];
  educationYears: any = [];
  minDate: object;
  currentUrlSection: string;
  profileMode: boolean = false;
  constructor(
    private validationService: ValidationService,
    public global: GlobalService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private caregiverService: CaregiverService,
    private elementReference: ElementRef,
    private navigationService: NavigationService,
    private constant: ConstantService,
    private translate: TranslateService,
    public layoutComponent: LayoutComponent
  ) {
    this.moment = extendMoment(Moment);
    this.registeredNumber = localStorage.getItem('registeredNumber');
    this.currentCaregiverType = localStorage.getItem('currentCaregiverType');
    this.currentStepFromStorage = localStorage.getItem('currentOnBoardingStep');
  }
  ngOnInit(): void {
    const urlParts: any = this.router.url.split('/');
    if (urlParts[2]) {
      this.currentUrlSection = urlParts[2];
    }
    if (this.currentUrlSection === 'profile') {
      this.profileMode = true;
      localStorage.setItem('caregiverOnBoardCompleted', '1'); // 1 ==> Completed
    } else {
      this.profileMode = false;
      localStorage.setItem('caregiverOnBoardCompleted', '0'); // 0 ==> In Complete
    }
    const current = new Date();
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    const date = new Date();
    const iterationNUmber = Number(date.getFullYear()) - 1959;
    const iterationEducationNUmber = Number(date.getFullYear()) - 1959;
    this.setWorkInfoForm();
    this.getWorkInfo();
    this.years = Array(iterationNUmber)
      .fill(1)
      .map((x, i) => i + 1960);
    this.educationYears = Array(iterationEducationNUmber)
      .fill(1)
      .map((x, i) => i + 1960);
  }
  setCurrentExperience(month, year) {
    const currentDate = new Date();
    let inputDate: any;
    inputDate = new Date(year, month - 1, 1);
    let dy = currentDate.getFullYear() - inputDate.getFullYear();
    let dm = currentDate.getMonth() - inputDate.getMonth();
    if (dm < 0) {
      dy -= 1;
      dm += 12;
    }
    this.yearsOfExperience = String(dy);
    this.monthsOfExperience = String(dm);
  }
  setPreviousEmployeeExperience(index) {
    const fromYear = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_year.value;
    const fromMonth = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_month.value;
    const toYear = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_year.value;
    const toMonth = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_month.value;
    const yearsExperience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.years_experience;
    const monthsExperience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.months_experience;

    const fromDate = new Date(fromYear, fromMonth - 1, 1);
    const toDate = new Date(toYear, toMonth - 1, 1);
    let dy = toDate.getFullYear() - fromDate.getFullYear();
    let dm = toDate.getMonth() - fromDate.getMonth();
    if (dm < 0) {
      dy -= 1;
      dm += 12;
    }
    yearsExperience.setValue(dy);
    monthsExperience.setValue(dm);
  }
  getWorkInfo() {
    this.caregiverService.getWorkInfo(this.registeredNumber).subscribe(
      (returnData: ApiResponse) => {
        const { success, data } = returnData;

        if (success) {
          const { employer, education, show_employer_option } = data[0];
          let {
            licence_expiry_date,
            previous_employer_details,
            current_employer_hospital_name,
            current_employer_work_type,
            current_employer_month,
            current_employer_year,
            current_employer_id } = data[0];
          if (employer.length === 0) {
            this.showRemoveEmployer = false;
          }
          if (education.length === 0) {
            this.showRemoveEducation = false;
          } else if (education.length > 1) {
            this.showRemoveEducation = true;
          }
          if (licence_expiry_date) {
            const date = new Date(licence_expiry_date);
            licence_expiry_date = { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
          }
          const object: any = [];
          previous_employer_details = [];
          employer.map((employeerData: any) => {
            if (employeerData.is_current_employer === '1') { // 1==> Current Employeer
              current_employer_hospital_name = employeerData.name;
              current_employer_work_type = employeerData.work_type;
              current_employer_month = employeerData.from_month;
              current_employer_year = employeerData.from_year;
              current_employer_id = employeerData.id;
              this.setCurrentExperience(current_employer_month, current_employer_year);
            } else {
              employeerData.company_name = employeerData.name;
              object.push(employeerData);
            }
          });
          data.show_employer_option = show_employer_option;
          data.current_employer_hospital_name = current_employer_hospital_name;
          data.current_employer_work_type = current_employer_work_type;
          data.current_employer_month = current_employer_month;
          data.current_employer_year = current_employer_year;
          data.current_employer_id = current_employer_id;
          data.licence_expiry_date = licence_expiry_date;
          this.workInfoForm.patchValue(data);
          const previousEmployerDetails = this.workInfoForm.get('previous_employer_details') as FormArray;
          object.map((previous: any, index) => {
            if (index > 0) {
              previousEmployerDetails.push(this.createPreviousEmployerDetails());
            }
          });
          previousEmployerDetails.patchValue(object);
          object.map((previous: any, index) => {
            this.setPreviousEmployeeExperience(index);
          });
          const educationDetails = this.workInfoForm.get('education_details') as FormArray;
          education.map((educationDetailsInside: any, index) => {
            if (index > 0) {
              educationDetails.push(this.createEducationDetails());
            }
          });
          educationDetails.patchValue(education);
        }
      }
    );
  }
  setWorkInfoForm() {
    if (this.profileMode === true) {
      this.workInfoForm = new FormGroup({
        show_employer_option: new FormControl({ value: '', disabled: false }, [Validators.required]),
        current_employer_hospital_name: new FormControl({ value: '', disabled: true }, [this.validationService.trimValidator, Validators.maxLength(50)]),
        current_employer_work_type: new FormControl({ value: '', disabled: true }, []),
        current_employer_month: new FormControl({ value: '', disabled: true }, []),
        current_employer_year: new FormControl({ value: '', disabled: true }, []),
        current_employer_id: new FormControl({ value: '', disabled: true }, []),
        previous_employer_details: this.formBuilder.array([this.createPreviousEmployerDetails()]),
        education_details: this.formBuilder.array([this.createEducationDetails()]),
      });
    } else {
      this.workInfoForm = new FormGroup({
        show_employer_option: new FormControl('', [Validators.required]),
        current_employer_hospital_name: new FormControl('', [this.validationService.trimValidator, Validators.maxLength(50)]),
        current_employer_work_type: new FormControl('', []),
        current_employer_month: new FormControl('', []),
        current_employer_year: new FormControl('', []),
        current_employer_id: new FormControl('', []),
        previous_employer_details: this.formBuilder.array([this.createPreviousEmployerDetails()]),
        education_details: this.formBuilder.array([this.createEducationDetails()]),
      });
    }

    if (this.currentCaregiverType === '1' || this.currentCaregiverType === '2') { // 1==> RN 2 ==> EN
      this.isRnEn = true;
      if (this.profileMode === true) {
        // Add License expiry date
        this.workInfoForm.addControl('licence_expiry_date', new FormControl({ value: '', disabled: true }, [Validators.required]));
      } else {
        // Add License expiry date
        this.workInfoForm.addControl('licence_expiry_date', new FormControl('', [Validators.required]));
      }
      this.workInfoForm.get('licence_expiry_date').updateValueAndValidity();
    } else {
      this.isRnEn = false;
    }
  }
  createEducationDetails(): FormGroup {
    if (this.profileMode === true) {
      return this.formBuilder.group({
        institute_name: new FormControl({ value: '', disabled: true }, [
          this.validationService.trimValidator,
          Validators.maxLength(50),
        ]),
        degree: new FormControl({ value: '', disabled: true }, [
          this.validationService.trimValidator,
          Validators.maxLength(50),
        ]),
        start_year: new FormControl({ value: '', disabled: true }, []),
        end_year: new FormControl({ value: '', disabled: true }, []),
        id: '',
      });
    } else {
      return this.formBuilder.group({
        institute_name: new FormControl('', [
          Validators.required,
          this.validationService.trimValidator,
          Validators.maxLength(50),
        ]),
        degree: new FormControl('', [
          Validators.required,
          this.validationService.trimValidator,
          Validators.maxLength(50),
        ]),
        start_year: new FormControl('', [Validators.required]),
        end_year: new FormControl('', [Validators.required]),
        id: '',
      });
    }
  }
  createPreviousEmployerDetails(): FormGroup {
    let attribute: any;
    if (this.profileMode === true) {
      attribute = { value: '', disabled: true };
    } else {
      attribute = '';
    }
    return this.formBuilder.group({
      company_name: new FormControl(attribute, [
        this.validationService.trimValidator,
        Validators.maxLength(50),
      ]),
      work_type: new FormControl(attribute, []),
      from_month: new FormControl(attribute, []),
      from_year: new FormControl(attribute, []),
      to_month: new FormControl(attribute, []),
      to_year: new FormControl(attribute, []),
      years_experience: '',
      months_experience: '',
      id: '',
    });
  }
  removeCurrentEmployer() {
    // Add ID in deleted Employer
    this.deletedEmployer.push(this.workInfoForm.get('current_employer_id').value);
    this.workInfoForm.patchValue({
      current_employer_id: '',
      current_employer_hospital_name: '',
      current_employer_work_type: '',
      current_employer_month: '',
      current_employer_year: ''
    });
    this.yearsOfExperience = '0';
    this.monthsOfExperience = '0';
  }
  removePreviousEmployer(index) {
    const previousEmployerDetails = this.workInfoForm.get(
      'previous_employer_details',
    ) as FormArray;
    // Add ID in deleted Employer
    this.deletedEmployer.push(
      this.workInfoForm.get('previous_employer_details')['controls'][index]
        .controls.id.value,
    );
    // Remove from formarray
    previousEmployerDetails.removeAt(index);
  }
  removeEducation(index) {
    const educationDetails = this.workInfoForm.get(
      'education_details',
    ) as FormArray;
    // Add ID in deleted Education
    this.deletedEducation.push(
      this.workInfoForm.get('education_details')['controls'][index].controls.id
        .value,
    );
    // Remove from formarray
    educationDetails.removeAt(index);
    if (educationDetails.length > 1) {
      this.showRemoveEducation = true;
    } else if (educationDetails.length === 1) {
      this.showRemoveEducation = false;
    }
  }
  addMoreEducation() {
    const educationDetails = this.workInfoForm.get(
      'education_details',
    ) as FormArray;
    if (educationDetails.length <= 4) {
      educationDetails.push(this.createEducationDetails());
    } else {
      this.showAddMoreEducation = false;
    }
    if (educationDetails.length > 0) {
      this.showRemoveEducation = true;
    }
  }
  addPreviousEmployer() {
    const previousEmployerDetails = this.workInfoForm.get(
      'previous_employer_details',
    ) as FormArray;
    if (previousEmployerDetails.length <= 4) {

      previousEmployerDetails.push(this.createPreviousEmployerDetails());
    } else {
      this.showAnotherPreviousEmployer = false;
    }
    if (previousEmployerDetails.length > 0) {
      this.showRemoveEmployer = true;
    }
  }
  checkDateValidation(event, type, index) {
    const fromMonth = this.workInfoForm.get('previous_employer_details')[
      'controls'
    ][index].controls.from_month.value;
    const fromyear = this.workInfoForm.get('previous_employer_details')[
      'controls'
    ][index].controls.from_year.value;
    const toMonth = this.workInfoForm.get('previous_employer_details')[
      'controls'
    ][index].controls.to_month.value;
    const toYear = this.workInfoForm.get('previous_employer_details')[
      'controls'
    ][index].controls.to_year.value;
    const years_experience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.years_experience;
    const months_experience = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.months_experience;

    if (fromMonth && fromMonth !== '' && fromyear && fromyear !== '' && toMonth && toMonth !== '' && toYear && toYear !== '') {
      const fromDate = new Date(fromyear, fromMonth - 1, 1);
      const toDate = new Date(toYear, toMonth - 1, 1);
      if (fromDate.getTime() >= toDate.getTime()) {
        this.workInfoForm
          .get('previous_employer_details')
        ['controls'][index].controls.from_month.setErrors({
          serverError: this.translate.instant(this.constant.FROM_DATE_SMALLER),
        });
      } else {
        // Calculate Experience
        let dy = toDate.getFullYear() - fromDate.getFullYear();
        let dm = toDate.getMonth() - fromDate.getMonth();
        if (dm < 0) {
          dy -= 1;
          dm += 12;
        }
        years_experience.setValue(dy);
        months_experience.setValue(dm);
        this.workInfoForm
          .get('previous_employer_details')
        ['controls'][index].controls.from_month.setErrors(null);
      }
    } else {
      this.workInfoForm
        .get('previous_employer_details')
      ['controls'][index].controls.from_month.setErrors({
        serverError: this.translate.instant(this.constant.SELECT_FROM_TO),
      });
    }
  }
  checkEducationDateValidation(event, index) {
    const instituteName = this.workInfoForm.get('education_details')['controls'][index].controls.institute_name.value;
    const startYear = this.workInfoForm.get('education_details')['controls'][index].controls.start_year.value;
    const endYear = this.workInfoForm.get('education_details')['controls'][index].controls.end_year.value;
    if (instituteName && instituteName !== null && instituteName !== '') {
      if (startYear && startYear !== '' && endYear && endYear !== '') {
        if (endYear < startYear) {
          this.workInfoForm
            .get('education_details')
          ['controls'][index].controls.start_year.setErrors({
            serverError: this.translate.instant(this.constant.FROM_YEAR_SMALLER),
          });
        } else {
          this.workInfoForm
            .get('education_details')
          ['controls'][index].controls.start_year.setErrors(null);
        }
      } else {
        this.workInfoForm
          .get('education_details')
        ['controls'][index].controls.start_year.setErrors({
          serverError: this.translate.instant(this.constant.SELECT_BOTH_YEARS),
        });
      }
    }
  }
  calculateExperience(event, type) {
    const currentEmployerMonth = this.workInfoForm.get('current_employer_month').value;
    const currentEmployerYear = this.workInfoForm.get('current_employer_year').value;
    const currentDate = new Date();
    if (currentEmployerMonth && currentEmployerYear) {
      let inputDate: any;
      if (type === 'year') {
        inputDate = new Date(event.target.value, currentEmployerMonth - 1, 1);
      } else if (type === 'month') {
        inputDate = new Date(currentEmployerYear, event.target.value - 1, 1);
      }
      let dy = currentDate.getFullYear() - inputDate.getFullYear();
      let dm = currentDate.getMonth() - inputDate.getMonth();
      if (dm < 0) {
        dy -= 1;
        dm += 12;
      }
      this.yearsOfExperience = String(dy);
      this.monthsOfExperience = String(dm);
      this.workInfoForm.controls.current_employer_month.setErrors(null);
    } else {
      this.yearsOfExperience = String(0);
      this.monthsOfExperience = String(0);
      this.workInfoForm.controls.current_employer_month.setErrors({
        serverError: this.translate.instant(this.constant.SELECT_MONTH_YEAR),
      });
    }
  }
  setLicenseExpiryDate() {
    const dateOfBirth = new Date(
      this.workInfoForm.value.licence_expiry_date.year,
      this.workInfoForm.value.licence_expiry_date.month - 1,
      this.workInfoForm.value.licence_expiry_date.day,
    );
    const formatedDated =
      dateOfBirth.getFullYear() +
      '-' +
      ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + dateOfBirth.getDate()).slice(-2);
    this.workInfoForm.value.licence_expiry_date = formatedDated;
  }
  setCurrentEmployer() {
    if (
      this.workInfoForm.value.current_employer_hospital_name &&
      this.workInfoForm.value.current_employer_month &&
      this.workInfoForm.value.current_employer_work_type &&
      this.workInfoForm.value.current_employer_year
    ) {
      const currentEmployerObject: any = {
        is_current_employer: String(1),
        name: this.workInfoForm.value.current_employer_hospital_name,
        work_type: this.workInfoForm.value.current_employer_work_type,
        from_month: this.workInfoForm.value.current_employer_month,
        from_year: this.workInfoForm.value.current_employer_year,
      };
      if (this.workInfoForm.value.current_employer_id) {
        currentEmployerObject.id = this.workInfoForm.value.current_employer_id;
      }
      return currentEmployerObject;
    }
  }
  setPreviousEmployer(dataToSend) {
    this.workInfoForm.value.previous_employer_details.map(
      (previous: any, previousIndex) => {
        if (
          previous.company_name !== '' &&
          previous.from_month !== '' &&
          previous.to_month !== '' &&
          previous.from_year !== '' &&
          previous.to_year !== '' &&
          previous.work_type !== ''
        ) {
          if (previous.to_year < previous.to_year) {
            this.workInfoForm
              .get('previous_employer_details')
            ['controls'][previousIndex].controls.start_year.setErrors({
              serverError: this.translate.instant(this.constant.SELECT_PROPER_DATES),
            });
          }
          const previousEmployerObject: any = {
            name: previous.company_name,
            work_type: previous.work_type,
            from_month: previous.from_month,
            from_year: previous.from_year,
            to_month: previous.to_month,
            to_year: previous.to_year,
            is_current_employer: String(0)
          };
          if (previous.id && previous.id > 0) {
            previousEmployerObject.id = previous.id;
          }
          dataToSend.employer.push(previousEmployerObject);
        } else {
          this.workInfoForm
            .get('previous_employer_details')
          ['controls'][previousIndex].controls.from_year.setErrors({
            serverError: this.translate.instant(this.constant.FILL_ALL),
          });
        }
      },
    );
  }
  setEducationDetails(dataToSend) {
    this.workInfoForm.value.education_details.map((education: any) => {
      if (
        education.degree !== '' &&
        education.end_year !== '' &&
        education.institute_name !== '' &&
        education.start_year !== ''
      ) {
        const educationObject: any = {};
        educationObject.institute_name = education.institute_name;
        educationObject.degree = education.degree;
        educationObject.start_year = education.start_year;
        educationObject.end_year = education.end_year;
        if (education.id && education.id > 0) {
          educationObject.id = education.id;
        }
        dataToSend.education.push(educationObject);
      }
    });
  }
  setFocus() {
    for (const key of Object.keys(this.workInfoForm.controls)) {
      if (this.workInfoForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        if (key !== 'education_details') {
          invalidControl.focus();
        }
        break;
      }
    }
  }
  setSendingData() {
    const dataToSend: any = {
      registration_no: this.registeredNumber
    };
    if (this.profileMode) {
      dataToSend.show_employer_option = this.workInfoForm.value.show_employer_option;
    } else {
      dataToSend.caregiver_type = this.currentCaregiverType;
      dataToSend.licence_expiry_date = this.workInfoForm.value.licence_expiry_date;
      dataToSend.show_employer_option = this.workInfoForm.value.show_employer_option;
      dataToSend.employer = [];
      const currentEmployerObject = this.setCurrentEmployer();
      if (currentEmployerObject && currentEmployerObject !== undefined) {
        dataToSend.employer.push(currentEmployerObject);
      }
      this.setPreviousEmployer(dataToSend);
      dataToSend.deleted_employer = this.deletedEmployer;
      dataToSend.deleted_education = this.deletedEducation;
      dataToSend.education = [];
      this.setEducationDetails(dataToSend);
    }
    return dataToSend;
  }
  checkPreviousEmployerBlock() {
    const previous_employer_details = this.workInfoForm.value.previous_employer_details;
    if (previous_employer_details.length > 0) {
      previous_employer_details.map((previousEmployer: any, index) => {
        const company_name = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.company_name;
        const work_type = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.work_type;
        const from_month = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_month;
        const from_year = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.from_year;
        const to_month = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_month;
        const to_year = this.workInfoForm.get('previous_employer_details')['controls'][index].controls.to_year;
        if (previousEmployer.company_name === '') {
          company_name.markAsTouched();
          company_name.setErrors({
            serverError: this.translate.instant(this.constant.HOSPITAL_NAME),
          });
        } else if (previousEmployer.work_type === '') {
          work_type.markAsTouched();
          work_type.setErrors({
            serverError: this.translate.instant(this.constant.WORK_TYPE),
          });
        } else if (previousEmployer.from_month === '') {
          from_month.markAsTouched();
          from_month.setErrors({
            serverError: this.translate.instant(this.constant.MONTH_REQUIRED),
          });
        } else if (previousEmployer.from_year === '') {
          from_year.markAsTouched();
          from_year.setErrors({
            serverError: this.translate.instant(this.constant.YEAR_REQUIRED),
          });
        } else if (previousEmployer.to_month === '') {
          to_month.markAsTouched();
          to_month.setErrors({
            serverError: this.translate.instant(this.constant.MONTH_REQUIRED),
          });
        } else if (previousEmployer.to_year === '') {
          to_year.markAsTouched();
          to_year.setErrors({
            serverError: this.translate.instant(this.constant.YEAR_REQUIRED),
          });
        }
      })
    }
  }
  checkEducationBlock() {
    const education_details = this.workInfoForm.value.education_details;
    if (education_details.length > 0) {
      education_details.map((education: any, index) => {
        const institute_name = this.workInfoForm.get('education_details')['controls'][index].controls.institute_name;
        const degree = this.workInfoForm.get('education_details')['controls'][index].controls.degree;
        const start_year = this.workInfoForm.get('education_details')['controls'][index].controls.start_year;
        const end_year = this.workInfoForm.get('education_details')['controls'][index].controls.end_year;
        if (education.institute_name === '') {
          institute_name.markAsTouched();
          institute_name.setErrors({
            serverError: this.translate.instant('Name of Institution is required'),
          });
        } else if (education.degree === '') {
          degree.markAsTouched();
          degree.setErrors({
            serverError: this.translate.instant('Degree/Programme is required'),
          });
        } else if (education.start_year === '') {
          start_year.markAsTouched();
          start_year.setErrors({
            serverError: this.translate.instant('Start Year is required'),
          });
        } else if (education.end_year === '') {
          end_year.markAsTouched();
          end_year.setErrors({
            serverError: this.translate.instant('End Year is required'),
          });
        }
      })
    }
  }
  public addWorkInfo() {
    if (!this.workInfoForm.valid) {
      this.validationService.validateAllFormFields(this.workInfoForm);
      this.checkEducationBlock();
      // this.checkPreviousEmployerBlock();
      this.setFocus();
      return false;
    }
    if (this.workInfoForm.value.licence_expiry_date) {
      this.setLicenseExpiryDate();
    }
    const dataToSend: any = this.setSendingData();
    const overlap = this.checkOverlapping(dataToSend.employer);
    if (overlap) {
      this.toastr.error(this.translate.instant(this.constant.DATA_OVERLAPPING));
      return false;
    }
    if (this.profileMode) {
      this.caregiverService.updateEmployerStatus(dataToSend).subscribe((returnData: ApiResponse) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          const step = this.navigationService.caregiverSteps.skillSet;
          this.layoutComponent.changeDropDownValueFromComponent('Skillset');
          this.navigationService.navigateCaregiver(this.navigationService.profileAction, step);
        }
      })
    } else {
      this.caregiverService.addUpdateCaregiverWorkInfo(dataToSend).subscribe(
        (returnData: ApiResponse) => {
          const { success, message } = returnData;
          if (success) {
            this.toastr.success(this.translate.instant(message));
            this.layoutComponent.changeDropDownValueFromComponent('Skillset');
            this.redirectAfterProcessing();
          }
        },
        err => {
          if (err.status === 400) {
            this.global.errorHandling(err, this.workInfoForm);
            this.validationService.validateAllFormFields(this.workInfoForm);
          }
        },
      );
    }
  }
  redirectAfterProcessing() {
    if (Number(this.currentStepFromStorage) > Number(this.navigationService.caregiverSteps.workInfo)) {
      this.global.currentOnBoardStep = this.currentStepFromStorage;
    } else {
      this.global.currentOnBoardStep = Number(this.navigationService.caregiverSteps.skillSet);
    }
    if (this.profileMode) {
      localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.onboardCompleted);
      const step = this.navigationService.caregiverSteps.skillSet;
      this.navigationService.navigateCaregiver(this.navigationService.profileAction, step);
    } else {
      localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.skillSet);
      const step = this.navigationService.caregiverSteps.skillSet;
      this.navigationService.navigateCaregiver(this.navigationService.onboardAction, step);
    }
  }

  checkOverlapping(employer) {
    if (employer && employer !== undefined) {
      const empData = JSON.parse(JSON.stringify(employer));
      const prevEmp = empData.filter((i, idx) => {
        i.tempIdx = idx;
        if (i.from_month && i.from_year) {
          i.from_date = this.moment()
            .year(i.from_year)
            .month(i.from_month - 1)
            .date(1);
        }
        if (i.to_month && i.to_year) {
          i.to_date = this.moment()
            .year(i.to_year)
            .month(i.to_month - 1)
            .date(1);
        } else {
          i.to_date = this.moment().date(1);
        }
        if (i.from_date && i.to_date) {
          i.range = this.moment.range(i.from_date, i.to_date);
        }
        return i;
      });
      const sortedPrevEmp = prevEmp.sort(this.sortDateFn);
      const groupeddata = this.groupByOverlap(sortedPrevEmp);
      return groupeddata;
    }

  }

  sortDateFn(previous, current) {
    const previousTime = previous.from_date
      ? previous.from_date.valueOf()
      : previous.valueOf();
    const currentTime = current.from_date
      ? current.from_date.valueOf()
      : current.valueOf();
    if (previousTime < currentTime) {
      return -1;
    }
    if (previousTime === currentTime) {
      return 0;
    }
    return 1;
  }

  groupByOverlap(prevEmp) {
    let count = 0;
    const groupedData = [];
    while (prevEmp.length) {
      const checkData = prevEmp.slice(1, prevEmp.length);
      const curr = prevEmp[0];
      const group = [curr];
      _.remove(prevEmp, item => curr.tempIdx === item.tempIdx);
      checkData.forEach(item => {
        if (curr.range.overlaps(item.range)) {
          count++;
        }
      });
      groupedData.push(group);
    }
    return count > 0 ? true : false;
  }
}
