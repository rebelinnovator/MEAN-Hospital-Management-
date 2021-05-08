import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/shared/services/global.service';

@Injectable()
export class OnboardResolver implements Resolve<any> {
  page: any;
  currentStep: any;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private global: GlobalService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    this.spinner.show();

    if (localStorage.getItem('user_type') !== '3') {
      this.router.navigate(['/']);
    }
    this.currentStep = localStorage.getItem('current_step');

    if (this.currentStep === 'null') {
      this.router.navigate(['/client/profile']);
    }

    switch (route.routeConfig.path) {
      case 'user-info':
        this.page = 1;
        break;
      case 'service-info':
        this.page = 2;
        break;
      case 'background':
        this.page = 3;
        break;
      case 'medical-history':
        this.page = 4;
        break;
      case 'terms-conditions':
        this.page = 5;
        break;
    }

    this.global.currentOnBoardStep = this.page;

    if (this.page <= this.currentStep) {
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
      }
    }
    this.spinner.hide();
  }
}
