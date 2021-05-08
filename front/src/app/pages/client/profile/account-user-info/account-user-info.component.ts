// Libraries
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// Services
import { GlobalService } from 'src/app/shared/services/global.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { GetAccountUserInfo, AccountUser, PostAccountUserInfo } from '../../client.interface';

// Component
import { ClientProfileLayoutComponent } from '../client-profile-layout/client-profile-layout.component';

@Component({
  selector: 'app-account-user-info',
  templateUrl: './account-user-info.component.html'
})
export class AccountUserInfoComponent implements OnInit {
  regularForm: FormGroup;
  userData: AccountUser;
  userId: string;
  constructor(
    private toastr: ToastrService,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private clientService: ClientService,
    private navigationService: NavigationService,
    private translate: TranslateService,
    private layout: ClientProfileLayoutComponent,
  ) {
    this.userId = localStorage.getItem('user_id');
  }

  ngOnInit(): void {
    this.setForm();
    if (this.userId) {
      this.getUserInfo();
    }
  }

  setForm() {
    this.regularForm = new FormGroup({
      user_id: new FormControl('', []),
      salute: new FormControl('', [Validators.required]),
      first_name: new FormControl({ disabled: true }, [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        this.validationService.emailValidator,
      ]),
      home_telephone_number: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumber,
      ]),
      mobile_number: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumber,
        this.validationService.mobileNumber,
      ]),
      relation_with_service_user: new FormControl('', []),
      preferred_communication_language: new FormControl('', [Validators.required]),
    });
  }

  getUserInfo() {
    this.clientService.getAccountUserInfo(this.userId).subscribe(
      (response: GetAccountUserInfo) => {
        const { success, data } = response;
        if (success) {
          const userData: AccountUser = data;
          const { user: { salute, mobile_number, email, preferred_communication_language } } = data;

          userData.salute = salute;
          userData.mobile_number = mobile_number;
          userData.email = email;
          userData.preferred_communication_language = preferred_communication_language;

          if (userData) {
            this.regularForm.patchValue(userData);
          } else {
            this.regularForm.patchValue({
              user_id: this.userId,
              email: localStorage.getItem('email'),
            });
          }
        }
      }
    );
  }

  onReactiveFormSubmit() {
    if (!this.regularForm.valid) {
      this.validationService.validateAllFormFields(this.regularForm);
      return false;
    }
    this.regularForm.value.isProfileCompleted = true;
    this.clientService.addUpdateAccountUserInfo(this.regularForm.value).subscribe(
      (response: PostAccountUserInfo) => {
        const { status, message } = response;
        if (status) {
          this.toastr.success(this.translate.instant(message));
          this.layout.changeDropDownValueFromComponent('Receiver')
          const step = this.navigationService.clientSteps.serviceInfo;
          this.navigationService.navigateClient(this.navigationService.profileAction, step);
        }
      },
      error => {
        if (error.status === 400) {
          this.globalService.errorHandling(error, this.regularForm);
        }
      },
    );
  }
}
