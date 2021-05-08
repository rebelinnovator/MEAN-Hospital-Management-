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
import { ClientLayoutComponent } from '../client-layout/client-layout.component';

@Component({
  selector: 'app-service-user-info',
  templateUrl: './service-user-info.component.html',
  // styleUrls: ['./service-user-info.component.css']
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
  minDate: object = {
    year: 1900,
    month: 1,
    day: 1,
  };
  constructor(
    private toastr: ToastrService,
    private globalService: GlobalService,
    private validationService: ValidationService,
    private clientService: ClientService,
    private navigationService: NavigationService,
    private translate: TranslateService,
    public layout: ClientLayoutComponent,
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
            this.regularForm.patchValue({
              service_user_dob: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
              },
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
    // Formating DOB
    const { service_user_dob } = this.regularForm.value;
    if (service_user_dob && (typeof (service_user_dob) === 'object')) {
      const dateOfBirth = new Date(
        service_user_dob.year,
        service_user_dob.month - 1,
        service_user_dob.day,
      );
      this.regularForm.value.service_user_dob =
        dateOfBirth.getFullYear() +
        '-' +
        ('0' + (dateOfBirth.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + dateOfBirth.getDate()).slice(-2);
    }

    this.clientService.addUpdateServiceUserInfo(this.regularForm.value).subscribe(
      (response: ApiResponse) => {
        const { success, message } = response;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          const step = this.navigationService.clientSteps.background;
          this.globalService.currentOnBoardStep = Number(step);
          this.globalService.currentStep = Number(step);
          localStorage.setItem('current_step', step);
          this.layout.changeDropDownValueFromComponent('Background');
          this.navigationService.navigateClient(this.navigationService.onboardAction, step);
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
