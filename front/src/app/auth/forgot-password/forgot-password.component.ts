import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  email: FormControl;
  type: number = 0;
  showForgotPasswordSuccess: boolean = false;

  constructor(
    public toastr: ToastrService,
    private router: Router,
    private validationService: ValidationService,
    private authService: AuthServiceService,
    private elementReference: ElementRef,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.setForgotPasswordForm();
  }

  public setForgotPasswordForm() {
    this.email = new FormControl('', [
      Validators.required,
      this.validationService.emailValidator,
    ]);
    this.forgotPasswordForm = new FormGroup({ email: this.email });
  }

  setFocus() {
    for (const key of Object.keys(this.forgotPasswordForm.controls)) {
      if (this.forgotPasswordForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }

  public forgotPassword() {
    if (!this.forgotPasswordForm.valid) {
      this.validationService.validateAllFormFields(this.forgotPasswordForm);
      this.setFocus();
      return false;
    }
    localStorage.setItem('email', this.forgotPasswordForm.value.email);
    const data: any = {
      email: this.forgotPasswordForm.value.email
    };
    this.authService.forgotPassword(data).subscribe();
    this.showForgotPasswordSuccess = true;
  }

  public backToLogin() {
    const { caregiverLogin, clientLogin, homePage } = this.navigationService;
    if (this.authService.type === 2) {
      this.router.navigateByUrl(caregiverLogin);
    } else if (this.authService.type === 3) {
      this.router.navigateByUrl(clientLogin);
    } else {
      this.router.navigateByUrl(homePage);
    }
  }

  sendMailAgain() {
    const email = localStorage.getItem('email');
    const data = { email };
    this.authService.resendForgotPasswordMail(data).subscribe();
    this.showForgotPasswordSuccess = true;
  }
}
