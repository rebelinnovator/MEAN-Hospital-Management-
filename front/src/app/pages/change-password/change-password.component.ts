import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../shared/services/global.service';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ApiResponse } from '../client/client.interface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  oldPassword: FormControl;
  password: FormControl;
  cnfmpassword: FormControl;
  score: number = 0;
  urlParts: string;

  constructor(
    public globalService: GlobalService,
    public toastr: ToastrService,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private elementReference: ElementRef,
    private caregiverService: CaregiverService,
    private navigationService: NavigationService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    const urlParts: any = this.router.url.split('/');
    if (urlParts[2]) {
      this.urlParts = urlParts[2];
    }
    this.setChangePasswordForm();
  }
  public setChangePasswordForm() {
    this.oldPassword = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);
    this.password = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);
    this.cnfmpassword = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);

    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: this.oldPassword,
        password: this.password,
        cnfmpassword: this.cnfmpassword,
      },
      {
        validators: this.validationService.MatchPassword,
      },
    );
  }
  setFocus() {
    for (const key of Object.keys(this.changePasswordForm.controls)) {
      if (this.changePasswordForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }
  setData() {
    const data: any = {
      old_password: this.changePasswordForm.value.oldPassword,
      password: this.changePasswordForm.value.password,
    };
    if (this.urlParts === 'client-change-password') {
      data.user_type = localStorage.getItem('user_type');
      data.slug = localStorage.getItem('slug');
    } else if (this.urlParts === 'caregiver-change-password') {
      data.registration_no = Number(localStorage.getItem('registeredNumber'));
      data.user_type = localStorage.getItem('user_type');
    }
    return data;
  }
  public changePassword() {
    if (!this.changePasswordForm.valid) {
      this.validationService.validateAllFormFields(this.changePasswordForm);
      this.setFocus();
      return false;
    }
    const data: any = this.setData();
    this.caregiverService.changePassword(data).subscribe(
      (returnData: ApiResponse) => {
        const { success, message } = returnData;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          localStorage.clear();
          this.redirection();
        }
      },
      err => {
        this.toastr.error(err.message);
      },
    );
  }
  redirection() {
    if (this.urlParts === 'client-change-password') {
      this.navigationService.navigateToClientLogin();
    } else if (this.urlParts === 'caregiver-change-password') {
      this.navigationService.navigateToCaregiverLogin();
    } else {
      this.navigationService.navigateToCaregiverLogin();
    }
  }
  passwordStrength(event) {
    const pass = event.target.value;
    this.score = 0;
    if (pass == null) {
      this.score = -1;
      return this.score;
    }
    if (pass.length < 6) {
      this.score = 1;
      return this.score;
    }
    if (/[0-9]/.test(pass)) {
      this.score++;
    }
    if (/[a-z]/.test(pass)) {
      this.score++;
    }
    if (/[A-Z]/.test(pass)) {
      this.score++;
    }
    return this.score;
  }
}
