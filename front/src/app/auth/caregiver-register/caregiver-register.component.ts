import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import { GlobalService } from '../../shared/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../auth.interface';

interface ActivateEmail {
  email: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './caregiver-register.component.html',
})
export class CaregiverRegisterComponent implements OnInit {
  caregiverRegisterForm: FormGroup;
  email: FormControl;
  password: FormControl;
  cnfmpassword: FormControl;
  score: number = 0;
  showActivateAccount: boolean = false;
  passwordIcon: string = 'assets/images/eye-close-icon.png';
  show: boolean = false;
  passType: string = 'password';

  constructor(
    public globalService: GlobalService,
    private validationService: ValidationService,
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
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
    this.cnfmpassword = new FormControl('', [
      Validators.required,
      this.validationService.passwordValidator,
    ]);

    this.caregiverRegisterForm = this.formBuilder.group(
      {
        email: this.email,
        password: this.password,
        cnfmpassword: this.cnfmpassword,
      },
      {
        validators: this.validationService.MatchPassword,
      },
    );
  }
  setFocus() {
    for (const key of Object.keys(this.caregiverRegisterForm.controls)) {
      if (this.caregiverRegisterForm.controls[key].invalid) {
        const invalidControl = this.elementReference.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]',
        );
        invalidControl.focus();
        break;
      }
    }
  }
  public caregiverRegister() {
    if (!this.caregiverRegisterForm.valid) {
      this.validationService.validateAllFormFields(this.caregiverRegisterForm);
      this.setFocus();
      return false;
    }
    this.caregiverRegisterForm.value.user_type = this.globalService.caregiverUserType;
    delete this.caregiverRegisterForm.value.cnfmpassword;
    this.authService.registerCaregiver(this.caregiverRegisterForm.value).subscribe(
      (returnData: ApiResponse) => {
        const { success } = returnData;
        if (success) {
          this.showActivateAccount = true;
          localStorage.setItem('email', this.caregiverRegisterForm.value.email);
        }
      },
      err => {
        if (err.status === 400) { // Only response code = 400 will be handeled here
          this.globalService.errorHandling(err, this.caregiverRegisterForm);
        }
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
    const data: ActivateEmail = { email };
    this.authService
      .activateAccountMailSendAgain(data)
      .subscribe((returnData: ApiResponse) => {
        const { success, message } = returnData;
        this.showActivateAccount = true;
        if (!success) {
          this.toastr.error(message);
        }
      });
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
}
