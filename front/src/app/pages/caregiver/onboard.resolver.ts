import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalService } from 'src/app/shared/services/global.service';

@Injectable()
export class CaregiverOnboardResolver implements Resolve<any> {
  page: any;
  caregiverOnBoardCompleted: any;
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private gloabl: GlobalService,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    this.spinner.show();
    if (localStorage.getItem('user_type') !== '2') {
      this.router.navigate(['/']);
    }
    this.caregiverOnBoardCompleted = localStorage.getItem(
      'caregiverOnBoardCompleted',
    );
    if (
      !this.caregiverOnBoardCompleted ||
      this.caregiverOnBoardCompleted === '' ||
      this.caregiverOnBoardCompleted === null
    ) {
      this.caregiverOnBoardCompleted = this.gloabl.caregiverOnBoardCompleted;
    }
    if (this.caregiverOnBoardCompleted === '0') {
      return '';
    } else {
      this.router.navigate(['/caregiver/profile/personal-info']);
    }
    this.spinner.hide();
  }
}
