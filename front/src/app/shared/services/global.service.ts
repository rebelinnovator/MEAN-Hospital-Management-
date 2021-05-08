import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  deviceID: string = '';
  currentLanguage: string = 'zh';
  // currentLanguage: string = 'en';
  currentOnBoardStep: any;
  caregiverOnBoardCompleted: any;
  showCaregiverMyProfile: any = '0';
  currentStep;
  checkboxValidaion: any;
  checkBoxValidationCaregiver: any;
  englishName: any;
  caregiverUserType = '2'; // user_type= [2==> Caregiver, 3==> Client] This is convention used in the DB
  clientUserType = '3';// user_type= [2==> Caregiver, 3==> Client] This is convention used in the DB
  personalCareType = '1';// care array type = [1 ==> Personal Care, 2 => Special Care] This is convention used in the DB
  specialCareType = '2';// care array type = [1 ==> Personal Care, 2 => Special Care] This is convention used in the DB
  languageIcon = 'assets/images/country-icon.svg';
  lengthValidatorMobile = 8;
  lengthValidatorBankName = 50;
  lengthValidatorBankCode = 15;
  lengthValidatorACC = 20;
  lengthValidatorName = 30;
  lengthValidatorNickName = 20;
  clientMinutes = 360; // The minutes before the client could not book the caregiver
  constructor(public translate: TranslateService, private router: Router) {
    if (
      localStorage.getItem('currentOnBoardingStep') &&
      localStorage.getItem('currentOnBoardingStep') !== '' &&
      localStorage.getItem('currentOnBoardingStep') !== null
    ) {
      this.currentOnBoardStep = localStorage.getItem('currentOnBoardingStep');
    } else {
      this.currentOnBoardStep = 8;
    }
    this.currentStep = localStorage.getItem('current_step');
  }

  switchLang() {
    if (this.currentLanguage === 'en') {
      this.currentLanguage = 'zh';
    } else if (this.currentLanguage === 'zh') {
      this.currentLanguage = 'en';
    }
    if (this.currentLanguage === 'en') {
      this.languageIcon = 'assets/images/country-icon.svg';
    } else if (this.currentLanguage === 'zh') {
      this.languageIcon = 'assets/images/great_britain_flag.svg';
    }
    this.translate.use(this.currentLanguage);
    localStorage.setItem('currentLanguage', this.currentLanguage);
  }
  errorHandling(err, form) {
    err.data.map((errorData: any) => {
      form.controls[errorData.field].setErrors({
        serverError: this.translate.instant(errorData.message),
      });
    });
    return form;
  }

  logout() {
    this.showCaregiverMyProfile = '0';
    this.caregiverOnBoardCompleted = '0';
    this.showCaregiverMyProfile = '0';
    this.checkboxValidaion = localStorage.getItem('checkBoxValidation');
    this.checkBoxValidationCaregiver = localStorage.getItem(
      'checkBoxValidationCaregiver',
    );
    localStorage.clear();
    localStorage.setItem('currentLanguage', this.currentLanguage);
    localStorage.setItem('checkBoxValidation', this.checkboxValidaion);
    localStorage.setItem(
      'checkBoxValidationCaregiver',
      this.checkBoxValidationCaregiver,
    );
    this.router.navigate(['/auth/caregiver-login']);
  }
}
