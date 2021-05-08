import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import { GlobalService } from '../../shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../auth.interface';

@Component({
  selector: 'app-client-register',
  templateUrl: './client-register.component.html',
})
export class ClientRegisterComponent implements OnInit {
  clientRegisterForm: FormGroup;
  email: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  score: number = 0;
  showActivateAccount: boolean = false;
  passwordIcon: string = '../../assets/images/eye-close-icon.png';
  show: boolean = false;
  passType: string = 'password';

  constructor(
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private globalService: GlobalService,
    private elementReference: ElementRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.setRegisterForm();
  }

  public setRegisterForm() {
    this.email = new FormControl('', [
      Validators.required,
      this.validationService.emailValidator,
    ]);

    this.password = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);
    this.confirmPassword = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);

    this.clientRegisterForm = this.formBuilder.group(
      {
        email: this.email,
        password: this.password,
        cnfmpassword: this.confirmPassword,
      },
      {
        validators: this.validationService.MatchPassword,
      },
    );
  }

  setFocus() {
    for (const key of Object.keys(this.clientRegisterForm.controls)) {
      if (this.clientRegisterForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }

  public clientRegister() {
    if (!this.clientRegisterForm.valid) {
      this.validationService.validateAllFormFields(this.clientRegisterForm);
      this.setFocus();
      return false;
    }
    const data = {
      email: this.clientRegisterForm.value.email,
      password: this.clientRegisterForm.value.password,
      user_type: this.globalService.clientUserType,
    };
    this.authService.registerCaregiver(data).subscribe((returnData: ApiResponse) => {
      const { success } = returnData;
      if (success) {
        this.showActivateAccount = true;
        localStorage.setItem('email', this.clientRegisterForm.value.email);
      }
    },
      err => {
        this.globalService.errorHandling(err, this.clientRegisterForm);
      },
    );
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

  activateAccountMailSendAgain() {
    const email = localStorage.getItem('email');
    const data = { email };
    this.authService.activateAccountMailSendAgain(data).subscribe((returnData: ApiResponse) => {
      const { success, message } = returnData;
      if (success) {
        this.showActivateAccount = true;
      } else {
        this.toastr.error(message);
      }
    });
  }

  toggleShow() {
    this.show = !this.show;
    if (this.show) {
      this.passwordIcon = '../../assets/images/eye-open-icon.png';
      this.passType = 'text';
    } else {
      this.passwordIcon = '../../assets/images/eye-close-icon.png';
      this.passType = 'password';
    }
  }
}
