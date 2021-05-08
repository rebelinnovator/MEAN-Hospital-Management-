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
import { SeederResponse, GetServiceUserInfo, ServiceUser, ApiResponse } from '../../client.interface';

// Component
import { ClientProfileLayoutComponent } from '../client-profile-layout/client-profile-layout.component';

@Component({
  selector: 'app-service-user-info',
  templateUrl: './service-user-info.component.html'
})
export class ServiceUserInfoComponent implements OnInit {
  regularForm: FormGroup;
  userData: ServiceUser;
  slug: string;
  locationsList: Array<object>;
  maxDate: object = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  constructor(
    private toastr: ToastrService,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private clientService: ClientService,
    private navigationService: NavigationService,
    private translate: TranslateService,
    private layout: ClientProfileLayoutComponent,
  ) {
    this.slug = localStorage.getItem('slug');
  }

  ngOnInit(): void {
    this.setForm();
    this.getLocations();
    if (this.slug) {
      this.getUserInfo();
    }
  }

  getLocations() {
    this.clientService.getLocationsList().subscribe(
      (response: SeederResponse) => {
        const { success, data } = response;
        if (success) {
          this.locationsList = data;
        }
      }
    );
  }

  setForm() {
    this.regularForm = new FormGroup({
      slug: new FormControl('', []),
      service_user_salute: new FormControl('', [Validators.required]),
      service_user_firstname: new FormControl('', [Validators.required]),
      service_user_lastname: new FormControl('', [Validators.required]),
      service_user_dob: new FormControl(null, [Validators.required]),
      servive_user_home_telephone: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumber,
      ]),
      service_user_mobile: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumber,
        this.validationService.mobileNumber,
      ]),
      service_user_flat_no: new FormControl('', [
        Validators.required,
        this.validationService.onlyNumber,
      ]),
      service_user_floor_no: new FormControl('', [Validators.required]),
      service_user_building_name: new FormControl('', [Validators.required]),
      service_user_street_name_number: new FormControl('', [Validators.required]),
      service_user_district: new FormControl(null, [Validators.required]),
    });
  }

  getUserInfo() {
    this.clientService.getServiceUserInfo(this.slug).subscribe(
      (response: GetServiceUserInfo) => {
        const { success, data } = response;
        if (success) {
          const userData = data;
          this.regularForm.patchValue(userData);
          if (userData.service_user_dob) {
            const date = new Date(userData.service_user_dob);
            // userData.service_user_dob = { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
            // const date = userData.service_user_dob.split('-');
            this.regularForm.patchValue({
              service_user_dob:
                { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }
              //  {
              //   year: parseInt(date[0], 10),
              //   month: parseInt(date[1], 10),
              //   day: parseInt(date[2], 10),
              // },
            });
          }
        }
      }
    );
  }
  setDate() {
    const { service_user_dob } = this.regularForm.value;
    const serviceUserDob = new Date(
      service_user_dob.year,
      service_user_dob.month - 1,
      service_user_dob.day,
    );
    const formatedDated =
      serviceUserDob.getFullYear() +
      '-' +
      ('0' + (serviceUserDob.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + serviceUserDob.getDate()).slice(-2);
    this.regularForm.value.service_user_dob = formatedDated;
  }
  onReactiveFormSubmit() {
    if (!this.regularForm.valid) {
      this.validationService.validateAllFormFields(this.regularForm);
      return false;
    }
    this.setDate();
    this.clientService.addUpdateServiceUserInfo(this.regularForm.value).subscribe(
      (response: ApiResponse) => {
        const { status, message } = response;
        if (status) {
          this.toastr.success(this.translate.instant(message));
          this.layout.changeDropDownValueFromComponent('Background');
          const step = this.navigationService.clientSteps.background;
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
