import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ToastrService } from 'ngx-toastr';
import { ClientLogin } from '../auth.interface';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
})
export class ClientLoginComponent implements OnInit {
  clientLoginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  type: number = 0;
  rememberedCredentials: boolean = false;
  rememberMe: FormControl;
  searchData: string;
  passwordIcon: string = 'assets/images/eye-close-icon.png';
  show: boolean = false;
  passType: string = 'password';
  redirectUrl: string

  constructor(
    private router: Router,
    private validationService: ValidationService,
    private authService: AuthServiceService,
    private global: GlobalService,
    private elementReference: ElementRef,
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    private toastr: ToastrService
  ) {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.redirectURL) {
          this.redirectUrl = params.redirectURL;
        }
      });
  }

  ngOnInit(): void {
    this.searchData = this.activatedRoute.snapshot.paramMap.get('searchData');
    this.setLoginForm();
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
    this.clientLoginForm = new FormGroup({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe,
    });
    this.rememberMeCheck();
  }

  rememberMeCheck() {
    if (localStorage.getItem('checkBoxValidation') && (localStorage.getItem('checkBoxValidation') !== 'null' && localStorage.getItem('checkBoxValidation') !== null)) {
      this.rememberedCredentials = true;
      const decoded = JSON.parse(
        atob(localStorage.getItem('checkBoxValidation')),
      );
      this.clientLoginForm.patchValue(decoded);
    }
  }

  setFocus() {
    for (const key of Object.keys(this.clientLoginForm.controls)) {
      if (this.clientLoginForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }

  setSednigData() {
    const data: any = {};
    data.email = this.clientLoginForm.value.email;
    data.password = this.clientLoginForm.value.password;
    data.user_type = this.global.clientUserType;
    return data;
  }

  setLocalStorage(data) {
    const { rememberMe } = this.clientLoginForm.value;
    if (rememberMe === true) {
      const userData: any = {};
      userData.email = this.clientLoginForm.value.email;
      userData.password = this.clientLoginForm.value.password;
      userData.rememberMe = true;
      const encoded = btoa(JSON.stringify(userData));
      localStorage.setItem('checkBoxValidation', encoded);
    }
    const { accessToken: { token }, user_id, email } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('email', email);
    localStorage.setItem('user_type', this.global.clientUserType);
    const { first_name, last_name } = data;
    if (first_name && last_name) {
      localStorage.setItem('englishName', first_name + ' ' + last_name);
    } else {
      localStorage.setItem('englishName', 'Guest');
    }
    const { current_step, slug } = data;
    if (current_step) {
      localStorage.setItem('current_step', current_step);
      this.global.currentStep = current_step;
    } else {
      localStorage.setItem('current_step', null);
      this.global.currentStep = null;
    }
    if (slug) {
      localStorage.setItem('slug', slug);
    }
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
    } else {
      if (this.searchData) {
        this.navigationService.navigateWithData(this.searchData);
      } else {
        const url = this.authService.redirectClient();
        if (url !== '/client/profile') {
          this.router.navigateByUrl(url);
        } else {
          this.router.navigateByUrl('/');
        }
      }
    }
  }

  public login() {
    if (!this.clientLoginForm.valid) {
      this.validationService.validateAllFormFields(this.clientLoginForm);
      this.setFocus();
      return false;
    }
    const sendingData: any = this.setSednigData();
    const checkBoxValidation: any = {};
    checkBoxValidation.email = this.clientLoginForm.value.email;
    checkBoxValidation.password = this.clientLoginForm.value.password;
    this.authService.caregiverLogin(sendingData).subscribe(
      (returnData: ClientLogin) => {
        const { success, data } = returnData;
        if (success) {
          this.setLocalStorage(data);
        }
      },
      err => {
        if (err.status === 400) {
          this.global.errorHandling(err, this.clientLoginForm);
          this.validationService.validateAllFormFields(this.clientLoginForm);
        } else {
          this.toastr.error(err.message);
        }
      },
    );
  }

  forgotPassword() {
    this.type = Number(this.global.clientUserType);
    this.authService.setGetType(this.type);
    this.navigationService.navigateToForgotPassword();
  }
}
