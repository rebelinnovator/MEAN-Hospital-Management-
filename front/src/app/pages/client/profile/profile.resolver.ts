import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class ProfileResolver implements Resolve<any> {
  page: any;
  currentStep: any;
  constructor(private router: Router, private spinner: NgxSpinnerService) {}

  resolve(route: ActivatedRouteSnapshot) {
    this.spinner.show();

    if (localStorage.getItem('user_type') !== '3') {
      this.router.navigate(['/']);
    }
    this.currentStep = localStorage.getItem('current_step');

    if (this.currentStep === 'null') {
      return '';
    } else {
      switch (this.currentStep.toString()) {
        case '1':
          this.router.navigate(['/client/onboard']);
          break;
        case '2':
          this.router.navigate(['/client/onboard/service-info']);
          break;
        case '3':
          this.router.navigate(['/client/onboard/background']);
          break;
        case '4':
          this.router.navigate(['/client/onboard/medical-history']);
          break;
        case '5':
          this.router.navigate(['/client/onboard/terms-conditions']);
          break;
        default:
          this.router.navigate(['/client/profile']);
      }
    }
    this.spinner.hide();
  }
}
