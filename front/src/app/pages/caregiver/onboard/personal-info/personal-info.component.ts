import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { GetAccountUserInfo, AccountUser, ApiResponse } from '../../caregiver.interface';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm: FormGroup;
  currentStepFromStorage: string;
  maxDate: object = {};
  minDate: object = {};
  languageArray: object = [
    { value: 1, name: 'Cantonese', selected: false },
    { value: 2, name: 'English', selected: false },
    { value: 3, name: 'Mandarin', selected: false },
    { value: 4, name: 'Others', selected: false },
  ];
  caregiverType: object = [
    {
      group: 'Nurses',
      types: [
        { id: 1, name: 'RN' },
        { id: 2, name: 'EN' },
      ],
    },
    {
      group: 'Support',
      types: [
        { id: 3, name: 'HW' },
        { id: 4, name: 'PCW' },
        { id: 5, name: 'Out-Patient Escort' },
      ],
    },
  ];
  showOtherLanguageOption: boolean = false;
  otherLanguageName: FormControl;
  registeredNumber: number = 0;
  fb = new FormBuilder();
  currentUrlSection: string;
  profileMode: boolean = false;
  personalInfoObject: any = {};
  constructor(
    private validationService: ValidationService,
    public global: GlobalService,
    private router: Router,
    private caregiverService: CaregiverService,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private constant: ConstantService,
    private translate: TranslateService,
    private layoutComponent: LayoutComponent
  ) { }

  ngOnInit() {
    this.currentStepFromStorage = localStorage.getItem('currentOnBoardingStep');
    const urlParts: any = this.router.url.split('/');
    if (urlParts[2] && urlParts[2] !== '') {
      this.currentUrlSection = urlParts[2];
    }
    if (this.currentUrlSection === 'profile') {
      this.profileMode = true;
      localStorage.setItem('caregiverOnBoardCompleted', '1'); // 1 ==> Completed
      localStorage.setItem('currentOnBoardingStep', '0'); // 0 ==> Redirect to first step
    } else {
      this.profileMode = false;
      localStorage.setItem('caregiverOnBoardCompleted', '0'); // 0 ==> In Complete
    }
    this.registeredNumber = Number(localStorage.getItem('registeredNumber'));
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.minDate = {
      year: current.getFullYear() - 120,
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.setPersonalInfoForm();
    if (
      this.registeredNumber &&
      !isNaN(this.registeredNumber) &&
      this.registeredNumber > 0
    ) {
      this.getUserPersonalInfo();
    }
  }
  getUserPersonalInfo() {
    this.caregiverService.getUserPersonalInfo(this.registeredNumber).subscribe(
      (returnData: GetAccountUserInfo) => {
        const { success, data } = returnData;
        if (success) {
          const { user: { salute, mobile_number, email, preferred_communication_language, dob }, caregiver_type, english_name, languages } = data;
          localStorage.setItem('currentCaregiverType', caregiver_type);
          if (english_name) {
            localStorage.setItem('englishName', english_name);
          }
          data.salute = salute;
          data.email = email;
          data.mobile_number = mobile_number;
          data.preferred_communication_language = preferred_communication_language;
          if (data.user.dob) {
            const date = new Date(dob);
            data.dob = { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
          }
          if (
            data.preferred_communication_language === null ||
            data.preferred_communication_language === 'null' ||
            data.preferred_communication_language === ''
          ) {
            data.preferred_communication_language = '1';
          }
          this.personalInfoForm.patchValue(data);
          this.personalInfoForm.patchValue({
            language: this.prefillLanguageSelection(
              this.personalInfoForm.get('language').value,
              languages,
            ),
          });
          this.personalInfoObject = data;
        }
      }
    );
  }
  prefillLanguageSelection(languages, selectedLanguages) {
    return languages.map(i => {
      const data = selectedLanguages.filter(
        x => Number(x.language) === Number(i.value),
      )[0];

      if (data && (data !== '' || data !== null || data !== undefined)) {
        i.selected = true;
        if (i.value === 4) {
          this.showOtherLanguageOption = true;
          if (this.profileMode === true) {
            this.otherLanguageName = new FormControl(
              { value: '', disabled: false },
              [
                Validators.required,
                this.validationService.trimValidator,
                Validators.maxLength(30),
              ],
            );
          } else {
            this.otherLanguageName = new FormControl('', [
              Validators.required,
              this.validationService.trimValidator,
              Validators.maxLength(30),
            ]);
          }

          this.personalInfoForm.addControl(
            'otherLanguageName',
            this.otherLanguageName,
          );
          this.personalInfoForm
            .get('otherLanguageName')
            .updateValueAndValidity();
          this.personalInfoForm.patchValue({
            otherLanguageName: data.other_lang,
          });
        }
      } else {
        i.selected = false;
      }
      return i;
    });
  }
  convertString(value) {
    return String(value);
  }
  setPersonalInfoForm() {
    if (this.profileMode) {
      this.personalInfoForm = new FormGroup({
        salute: new FormControl({ value: '', disabled: true }, []),
        chinese_name: new FormControl({ value: '', disabled: true }, []),
        english_name: new FormControl({ value: '', disabled: true }, []),
        nick_name: new FormControl({ value: '', disabled: true }, []),
        email: new FormControl('', [
          this.validationService.trimValidator,
          Validators.required,
          this.validationService.emailValidator,
        ]),
        hkid_card_no: new FormControl({ value: '', disabled: true }, []),
        dob: new FormControl({ value: '', disabled: true }, []),
        language: this.createLanguages(this.languageArray),
        caregiver_type: new FormControl({ value: '', disabled: true }, []),
        mobile_number: new FormControl('', [
          this.validationService.trimValidator,
          Validators.maxLength(8),
          Validators.minLength(8),
          this.validationService.onlyNumber,
        ]),
        refferers_email: new FormControl({ value: '', disabled: true }, []),
        preferred_communication_language: new FormControl(
          { value: '', disabled: true },
          [],
        ),
      });
    } else {
      this.personalInfoForm = new FormGroup({
        salute: new FormControl('', [Validators.required]),
        chinese_name: new FormControl('', [
          Validators.required,
          this.validationService.trimValidator,
          Validators.maxLength(this.global.lengthValidatorName),
        ]),
        english_name: new FormControl('', [
          Validators.required,
          this.validationService.trimValidator,
          Validators.maxLength(this.global.lengthValidatorName),
          this.validationService.alphaNumericValidator,
        ]),
        nick_name: new FormControl('', [
          Validators.required,
          this.validationService.trimValidator,
          Validators.maxLength(this.global.lengthValidatorNickName),
        ]),
        email: new FormControl('', [
          this.validationService.trimValidator,
          Validators.required,
          this.validationService.emailValidator,
        ]),
        hkid_card_no: new FormControl('', [
          Validators.required,
          this.validationService.trimValidator,
          this.validationService.alphaNumericValidator,
          Validators.maxLength(4),
        ]),
        dob: new FormControl('', [Validators.required]),
        language: this.createLanguages(this.languageArray),
        caregiver_type: new FormControl('', [Validators.required]),
        mobile_number: new FormControl('', [
          Validators.required,
          this.validationService.trimValidator,
          Validators.maxLength(this.global.lengthValidatorMobile),
          Validators.minLength(this.global.lengthValidatorMobile),
          this.validationService.onlyNumber,
        ]),
        refferers_email: new FormControl('', [
          this.validationService.trimValidator,
          this.validationService.emailValidator,
        ]),
        preferred_communication_language: new FormControl(
          { value: '1', disabled: false },
          [Validators.required],
        ),
      });
    }
  }
  createLanguages(languageInputs) {
    return this.fb.array(
      languageInputs.map(i => {
        return this.fb.group({
          name: i.name,
          selected: i.selected,
          value: i.value,
          disabled: this.profileMode,
        });
      }),
    );
  }
  showOthers() {
    const language = this.personalInfoForm.controls.language.value;
    if (language.length > 0) {
      language.map(
        (languageChecked: any, index) => {
          if (index === 3 && languageChecked.selected === true) {
            this.showOtherLanguageOption = true;
            if (
              !this.personalInfoForm.controls.otherLanguageName &&
              this.personalInfoForm.controls.otherLanguageName === undefined
            ) {
              this.otherLanguageName = new FormControl('', [
                Validators.required,
                this.validationService.trimValidator,
                Validators.maxLength(30),
              ]);
              this.personalInfoForm.addControl(
                'otherLanguageName',
                this.otherLanguageName,
              );
              this.personalInfoForm
                .get('otherLanguageName')
                .updateValueAndValidity();
            }
          } else if (index === 3 && languageChecked.selected === false) {
            this.showOtherLanguageOption = false;
            this.personalInfoForm.removeControl('otherLanguageName');
          }
        },
      );
    }
  }
  setBirthDate() {
    const dob = this.personalInfoForm.value.dob;
    if (dob) {
      const dateOfBirth = new Date(dob.year, dob.month - 1, dob.day);
      const formatedDated = dateOfBirth.getFullYear() + '-' + ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) + '-' + ('0' + dateOfBirth.getDate()).slice(-2);
      this.personalInfoForm.value.dob = formatedDated;
    } else {
      this.personalInfoForm.value.dob = '';
    }
  }
  makeSelectedLanguage(languageSelected) {
    this.personalInfoForm.value.language.map((language: any, index) => {
      if (language.selected === true) {
        const tempArray: any = {};
        tempArray.language = language.value;
        if (index === 3) {
          tempArray.other_lang = this.personalInfoForm.value.otherLanguageName;
        }
        languageSelected.push(tempArray);
      }
    });
  }
  setDOB(dataToSend) {
    let dob = this.personalInfoObject.user.dob;
    if (dob) {
      const [year, month, day] = dob.split('-');
      dob = {
        year: parseInt(year, 10),
        month: parseInt(month, 10),
        day: parseInt(day.split(' ')[0].trim(), 10),
      };
      const dateOfBirth = new Date(dob.year, dob.month - 1, dob.day);
      const formatedDated =
        dateOfBirth.getFullYear() +
        '-' +
        ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + dateOfBirth.getDate()).slice(-2);
      dataToSend.dob = formatedDated;
    }
  }
  setSendingData() {
    let dataToSend: any = {};// Not sure of all data it may include that's why added the type as ANY
    const formValue = this.personalInfoForm.value;
    if (this.profileMode) {
      dataToSend = this.personalInfoObject;
      dataToSend.email = formValue.email;
      dataToSend.mobile_number = formValue.mobile_number;
      dataToSend.registration_no = this.registeredNumber;
      dataToSend.salute = this.personalInfoObject.user.salute;
      dataToSend.languages = formValue.languages;
      this.setDOB(dataToSend);
      dataToSend.preferred_communication_language = this.personalInfoObject.user.preferred_communication_language;
    } else {
      this.setDOB(dataToSend);
      dataToSend = formValue;
    }
    if (!dataToSend.refferers_email || dataToSend.refferers_email === '') {
      delete dataToSend.refferers_email;
    }
    return dataToSend;
  }
  public addPersonalInfo() {
    if (!this.personalInfoForm.valid) {
      this.validationService.validateAllFormFields(this.personalInfoForm);
      return false;
    }
    this.setBirthDate();
    const languageSelected: any = [];
    this.makeSelectedLanguage(languageSelected);
    this.personalInfoForm.value.languages = languageSelected;
    if (this.personalInfoForm.value.languages.length === 0) {
      this.toastr.error(this.translate.instant(this.constant.SELECT_ONE_LANGUAGE));
      return false;
    }
    this.personalInfoForm.value.registration_no = this.registeredNumber;
    const dataToSend: any = this.setSendingData();
    this.caregiverService.addUpdateCaregiverInfo(dataToSend).subscribe(
      (returnData: ApiResponse) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          this.layoutComponent.changeDropDownValueFromComponent('Work');
          this.setRedirection(dataToSend);
        }
      },
      err => {
        if (err.status === 400) {
          this.global.errorHandling(err, this.personalInfoForm);
          this.validationService.validateAllFormFields(this.personalInfoForm);
        }
      },
    );
  }
  setRedirection(dataToSend) {
    if (dataToSend.english_name) {
      localStorage.setItem('englishName', dataToSend.english_name);
      this.global.englishName = dataToSend.english_name;
    }
    if (Number(this.currentStepFromStorage) > Number(this.navigationService.caregiverSteps.workInfo)) {
      this.global.currentOnBoardStep = this.currentStepFromStorage;
    } else {
      this.global.currentOnBoardStep = Number(this.navigationService.caregiverSteps.workInfo);
    }
    if (this.profileMode) {
      localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.onboardCompleted);
      localStorage.setItem('currentCaregiverType', dataToSend.caregiver_type);
      const step = this.navigationService.caregiverSteps.workInfo;
      this.navigationService.navigateCaregiver(this.navigationService.profileAction, step);
    } else {
      localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.workInfo);
      localStorage.setItem('currentCaregiverType', this.personalInfoForm.value.caregiver_type);
      const step = this.navigationService.caregiverSteps.workInfo;
      this.navigationService.navigateCaregiver(this.navigationService.onboardAction, step);
    }
  }
}
