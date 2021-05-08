import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class CaregiverProfileResolver implements Resolve<any> {
  page: any;
  currentStep: any;
  constructor(private router: Router, private spinner: NgxSpinnerService) {}

  resolve(route: ActivatedRouteSnapshot) {
    this.spinner.show();
    if (localStorage.getItem('user_type') !== '2') {
      this.router.navigate(['/']);
    }
    this.currentStep = localStorage.getItem('currentOnBoardingStep');
    if (
      this.currentStep === null ||
      this.currentStep === 'null' ||
      this.currentStep === '0'
    ) {
      return '';
    } else {
      switch (this.currentStep.toString()) {
        case '1':
          this.router.navigate(['/caregiver/onboard/personal-info']);
          break;
        case '2':
          this.router.navigate(['/caregiver/onboard/work-info']);
          break;
        case '3':
          this.router.navigate(['/caregiver/onboard/skillset']);
          break;
        case '4':
          this.router.navigate(['/caregiver/onboard/availability']);
          break;
        case '5':
          this.router.navigate(['/caregiver/onboard/charges']);
          break;
        case '6':
          this.router.navigate(['/caregiver/onboard/documents']);
          break;
        case '7':
          this.router.navigate(['/caregiver/onboard/terms-and-condition']);
          break;
        case '0':
          this.router.navigate(['/caregiver/onboard/terms-and-condition']);
          break;
        default:
          this.router.navigate(['/caregiver/profile/personal-info']);
      }
    }
    this.spinner.hide();
  }
}
