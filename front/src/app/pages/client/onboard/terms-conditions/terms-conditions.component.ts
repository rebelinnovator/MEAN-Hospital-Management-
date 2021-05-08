// Libraries
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Services
import { GlobalService } from 'src/app/shared/services/global.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { TnC, ApiResponse } from '../../client.interface';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  // styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  regularForm: FormGroup;
  userData: any = {};
  slug: string;
  date: Date = new Date();
  constructor(
    public globalService: GlobalService,
    private validationService: ValidationService,
    private clientService: ClientService,
    private navigationService: NavigationService,
  ) {
    this.slug = localStorage.getItem('slug');
  }

  ngOnInit(): void {
    this.setForm();
    if (this.slug) {
      this.getTermsConditionInfo();
    }
  }

  setForm() {
    this.regularForm = new FormGroup({
      slug: new FormControl('', []),
      hkid_name: new FormControl('', [Validators.required]),
      tnc_accepted_date: new FormControl('', [Validators.required]),
    });
  }

  getTermsConditionInfo() {
    this.clientService.getClientTermsConditions(this.slug).subscribe(
      (response: TnC) => {
        const { success, data } = response;
        if (success) {
          this.userData = data;
          this.regularForm.patchValue(this.userData);

          const formatDate =
            ('0' + this.date.getDate()).slice(-2) +
            '/' +
            ('0' + (this.date.getMonth() + 1)).slice(-2) +
            '/' +
            this.date.getFullYear();
          this.regularForm.patchValue({
            tnc_accepted_date: formatDate,
          });
        }
      }
    );
  }

  onReactiveFormSubmit() {
    if (!this.regularForm.valid) {
      this.validationService.validateAllFormFields(this.regularForm);
      return false;
    }

    const formatDate =
      this.date.getFullYear() +
      '-' +
      ('0' + (this.date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + this.date.getDate()).slice(-2);

    this.regularForm.value.tnc_accepted_date = formatDate;

    this.clientService.addUpdateClientTermsConditions(this.regularForm.value).subscribe(
      (response: ApiResponse) => {
        const { success } = response;
        if (success) {
          const step = this.navigationService.clientSteps.thanks;
          this.globalService.currentStep = Number(step);
          localStorage.setItem('current_step', step);
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
