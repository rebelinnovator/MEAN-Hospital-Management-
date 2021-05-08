import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ResetPassword } from '../auth.interface';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  resetPasswordForm: FormGroup;
  password: FormControl;
  cnfmpassword: FormControl;
  score: number = 0;
  showResetSuccess: boolean = false;
  passwordIconConfirm: string = 'assets/images/eye-open-icon.png';
  passwordIcon: string = 'assets/images/eye-close-icon.png';
  show: boolean = false;
  passType: string = 'password';

  constructor(
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private elementReference: ElementRef,
    private navigationService: NavigationService,
    public translate: TranslateService,
    private global: GlobalService,
  ) {
    if (localStorage.getItem('currentLanguage') && (localStorage.getItem('currentLanguage') !== null || localStorage.getItem('currentLanguage') !== 'null')) {
      this.global.currentLanguage = localStorage.getItem('currentLanguage');
    } else {
      this.global.currentLanguage = 'zh';
      localStorage.setItem('currentLanguage', this.global.currentLanguage);
    }
    translate.setDefaultLang(this.global.currentLanguage);
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.route.queryParamMap.subscribe(queryParams => {
      this.token = queryParams.get('token');
    });
    this.setResetPasswordForm();
  }
  toggleShow() {
    this.show = !this.show;
    if (this.show) {
      this.passwordIcon = 'assets/images/eye-open-icon.png';
      this.passType = 'text';
    } else {
      this.passwordIcon = 'assets/images/eye-close-icon.png';
      this.passType = 'password';
    }
  }
  public setResetPasswordForm() {
    this.password = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);
    this.cnfmpassword = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: this.password,
        cnfmpassword: this.cnfmpassword,
      },
      {
        validators: this.validationService.MatchPassword,
      },
    );
  }
  setFocus() {
    for (const key of Object.keys(this.resetPasswordForm.controls)) {
      if (this.resetPasswordForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }
  public resetPassword() {
    if (!this.resetPasswordForm.valid) {
      this.validationService.validateAllFormFields(this.resetPasswordForm);
      this.setFocus();
      return false;
    }
    const dataToSend = {
      password: this.resetPasswordForm.value.password,
      token: this.token
    };
    this.authService.resetPassword(dataToSend).subscribe(
      (returnData: ResetPassword) => {
        const { success, data: { user_type } } = returnData;
        if (success) {
          localStorage.clear();
          localStorage.setItem('user_type', user_type);
          this.showResetSuccess = true;
        }
      },
      err => {
        this.toastr.error(err.message);
      },
    );
  }
  redirection() {
    const userType = localStorage.getItem('user_type');
    if (userType && userType !== undefined) {
      this.navigationService.navigateToLogin(userType);
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
    if (/[^A-Z-0-9]/i.test(pass)) {
      // this.score++;
    }
    return this.score;
  }
}
