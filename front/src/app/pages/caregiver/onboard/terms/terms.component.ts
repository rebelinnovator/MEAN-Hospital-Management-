import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../shared/services/global.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { Router } from '@angular/router';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SendingDataTerms, ApiResponse } from '../../caregiver.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
})
export class TermsComponent implements OnInit {
  maxDate: object = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  termsForm: FormGroup;
  registrationNo: number = 0;
  currentDate: object;
  currentStepFromStorage: string;
  constructor(
    private validationService: ValidationService,
    public global: GlobalService,
    private router: Router,
    private toastr: ToastrService,
    private caregiverService: CaregiverService,
    private navigationService: NavigationService,
    private translate: TranslateService
  ) {
    this.currentStepFromStorage = localStorage.getItem('currentOnBoardingStep');
    if (localStorage.getItem('showCaregiverMyProfile') === '1') {
      this.router.navigate(['/caregiver/profile/personal-info']);
    }
  }
  ngOnInit(): void {
    this.registrationNo = Number(localStorage.getItem('registeredNumber'));
    this.setTermsForm();
    this.patchDate();
  }
  patchDate() {
    const d = new Date();
    let monthNew = '' + (d.getMonth() + 1);
    let daynew = '' + d.getDate();
    const yearNew = String(d.getFullYear());
    if (monthNew.length < 2) {
      monthNew = '0' + monthNew;
    }
    if (daynew.length < 2) {
      daynew = '0' + daynew;
    }
    this.currentDate = {
      year: parseInt(yearNew, 10),
      month: parseInt(monthNew, 10),
      day: parseInt(daynew.split(' ')[0].trim(), 10),
    };
    this.termsForm.patchValue({
      date: this.currentDate,
    });
  }
  setTermsForm() {
    this.termsForm = new FormGroup({
      hkid_fullName: new FormControl('', [
        Validators.required,
        this.validationService.trimValidator,
        Validators.maxLength(30)
      ]),
      date: new FormControl({ disabled: true }, [Validators.required]),
    });
  }
  setDOB() {
    const dateOfBirth = new Date(
      this.termsForm.value.date.year,
      this.termsForm.value.date.month - 1,
      this.termsForm.value.date.day,
    );
    const formatedDated =
      dateOfBirth.getFullYear() +
      '-' +
      ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + dateOfBirth.getDate()).slice(-2);
    this.termsForm.value.date = formatedDated;
  }
  completeRedirection() {
    localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.onboardCompleted);
    if (Number(this.currentStepFromStorage) > Number(this.navigationService.caregiverSteps.terms)) {
      this.global.currentOnBoardStep = this.currentStepFromStorage;
    } else {
      this.global.currentOnBoardStep = Number(this.navigationService.caregiverSteps.terms);
    }
    this.global.caregiverOnBoardCompleted = this.navigationService.caregiverSteps.personalInfo;
    localStorage.setItem('caregiverOnBoardCompleted', '1'); // 1==> Completed
    localStorage.setItem('showCaregiverMyProfile', '1'); // 1==> show my profile
    this.global.showCaregiverMyProfile = '1';// 1==> show my profile
    const step = this.navigationService.caregiverSteps.thanks;
    this.navigationService.navigateCaregiver(this.navigationService.onboardAction, step);
  }
  public submitDetails() {
    if (!this.termsForm.valid) {
      this.validationService.validateAllFormFields(this.termsForm);
      return false;
    }
    this.setDOB();
    const sendingData: SendingDataTerms = {
      registration_no: this.registrationNo,
      tnc_accepted_date: this.termsForm.value.date,
      hkid_name: this.termsForm.value.hkid_fullName
    };
    this.caregiverService.sendTermsAndConditionsMail(sendingData).subscribe(
      (returnData: ApiResponse) => {
        const { success } = returnData;
        if (success) {
          this.completeRedirection();
        }
      },
      err => {
        if (err.status === 400) {
          this.global.errorHandling(err, this.termsForm);
          this.validationService.validateAllFormFields(this.termsForm);
        } else {
          this.toastr.error(this.translate.instant(err.message));
        }
      },
    );
  }
}
