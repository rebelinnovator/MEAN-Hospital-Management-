import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { CaregiverLogin } from '../auth.interface';

@Component({
  selector: 'app-caregiver-login',
  templateUrl: './caregiver-login.component.html',
})
export class CaregiverLoginComponent implements OnInit {
  caregiverLoginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  rememberMe: FormControl;
  rememberedCredentials: boolean = false;
  type: number = 0;
  passwordIcon: string = 'assets/images/eye-close-icon.png';
  show: boolean = false;
  passType: string = 'password';
  redirectUrl: string;

  constructor(
    private router: Router,
    private validationService: ValidationService,
    private authService: AuthServiceService,
    public global: GlobalService,
    private elementReference: ElementRef,
    private toastr: ToastrService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setLoginForm();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.redirectURL) {
        this.redirectUrl = params.redirectURL;
      }
    });
    if (this.redirectUrl) {
      if (this.redirectUrl.includes('client')) {
        this.navigationService.navigateToClientLoginWithParams(this.redirectUrl);
      }
    }
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

  public setLoginForm() {
    this.email = new FormControl('', [
      Validators.required,
      this.validationService.emailValidator,
    ]);
    this.password = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);
    this.rememberMe = new FormControl('');
    this.caregiverLoginForm = new FormGroup({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe,
    });
    this.rememberMeCheck();
  }

  rememberMeCheck() {
    if (localStorage.getItem('checkBoxValidationCaregiver') && (localStorage.getItem('checkBoxValidationCaregiver') !== 'null' && localStorage.getItem('checkBoxValidationCaregiver') !== null)) {
      this.rememberedCredentials = true;
      const decoded = JSON.parse(
        atob(localStorage.getItem('checkBoxValidationCaregiver')),
      );
      this.caregiverLoginForm.patchValue(decoded);
    }
  }

  setFocus() {
    for (const key of Object.keys(this.caregiverLoginForm.controls)) {
      if (this.caregiverLoginForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }

  serRememberMe() {
    const { rememberMe, email, password } = this.caregiverLoginForm.value;
    if (rememberMe === true) {
      const userData = {
        email,
        password,
        rememberMe: true,
      };
      const encoded = btoa(JSON.stringify(userData));
      localStorage.setItem('checkBoxValidationCaregiver', encoded);
    }
  }

  public login() {
    if (!this.caregiverLoginForm.valid) {
      this.validationService.validateAllFormFields(this.caregiverLoginForm);
      this.setFocus();
      return false;
    }
    this.caregiverLoginForm.value.user_type = this.global.caregiverUserType;
    this.authService.caregiverLogin(this.caregiverLoginForm.value).subscribe(
      (returnData: CaregiverLogin) => {
        const { success, data } = returnData;
        if (success) {
          this.serRememberMe();
          this.setLocalStorgae(data);
          this.redirection();
        }
      },
      err => {
        if (err.status === 400) {
          this.global.errorHandling(err, this.caregiverLoginForm);
          this.validationService.validateAllFormFields(this.caregiverLoginForm);
        } else {
          this.toastr.error(err.message);
        }
      },
    );
  }

  setLocalStorgae(data) {
    const { english_name, accessToken: { token }, registration_no, current_step, caregiver_type } = data;
    localStorage.setItem('user_type', this.global.caregiverUserType);
    localStorage.setItem('englishName', english_name);
    localStorage.setItem('token', token);
    localStorage.setItem('registeredNumber', registration_no);
    localStorage.setItem('currentOnBoardingStep', current_step);
    localStorage.setItem('currentCaregiverType', caregiver_type);
    this.global.currentOnBoardStep = current_step;
    this.global.caregiverOnBoardCompleted = '0';
    localStorage.setItem('caregiverOnBoardCompleted', '0');
    localStorage.setItem('showCaregiverMyProfile', '0');
    this.global.showCaregiverMyProfile = '0';
  }

  forgotPassword() {
    this.type = Number(this.global.caregiverUserType);
    this.authService.setGetType(this.type);
    this.router.navigateByUrl('/auth/forgot-password');
  }

  redirection() {
    const { currentOnBoardStep } = this.global;
    if (this.redirectUrl) {
      if (currentOnBoardStep === null) {
        this.global.showCaregiverMyProfile = '1'; // 1==> Show Profile
        localStorage.setItem('showCaregiverMyProfile', '1'); // 1==> Show Profile
      }
      this.router.navigateByUrl(this.redirectUrl);
    } else {
      if (currentOnBoardStep !== null) {
        this.navigationService.navigateCaregiver(this.navigationService.onboardAction, String(currentOnBoardStep))
      } else {
        this.global.showCaregiverMyProfile = '1'; // 1==> Show Profile
        localStorage.setItem('showCaregiverMyProfile', '1'); // 1==> Show Profile
        // this.navigationService.navigateCaregiver(this.navigationService.profileAction)
        this.router.navigateByUrl('/');
      }
    }
  }
}
