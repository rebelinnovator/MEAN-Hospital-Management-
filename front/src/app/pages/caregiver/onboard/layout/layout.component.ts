import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  currentUrlSection: string;
  profileMode = false;
  currentDropdownValue: string = '';
  currentUrlLink: string = '';
  constructor(public global: GlobalService, private router: Router) { }

  ngOnInit(): void {
    const urlParts: any = this.router.url.split('/');
    if (urlParts[2]) {
      this.currentUrlSection = urlParts[2];
    }
    if (urlParts[3]) {
      this.currentUrlLink = urlParts[3];
    }
    if (this.currentUrlLink === 'personal-info') {
      this.currentDropdownValue = 'Personal';
    } else if (this.currentUrlLink === 'work-info') {
      this.currentDropdownValue = 'Work';
    } else if (this.currentUrlLink === 'skillset') {
      this.currentDropdownValue = 'Skillset';
    } else if (this.currentUrlLink === 'availability') {
      this.currentDropdownValue = 'Availability';
    } else if (this.currentUrlLink === 'charges') {
      this.currentDropdownValue = 'Charges';
    } else if (this.currentUrlLink === 'documents') {
      this.currentDropdownValue = 'Documents';
    } else if (this.currentUrlLink === 'terms-and-condition') {
      this.currentDropdownValue = 'Terms';
    } else if (this.currentUrlLink === 'referral-bonus') {
      this.currentDropdownValue = 'Referral';
    }
    if (this.currentUrlSection === 'profile') {
      this.profileMode = true;
    } else {
      this.profileMode = false;
    }
  }
  changeDropDownValueFromComponent(value) {
    this.currentDropdownValue = value;
  }
  redirect(event) {
    if (event.target.value === 'Personal') {
      this.router.navigate([`/caregiver/profile/personal-info`]);
    } else if (event.target.value === 'Work') {
      this.router.navigate([`/caregiver/profile/work-info`]);
    } else if (event.target.value === 'Skillset') {
      this.router.navigate([`/caregiver/profile/skillset`]);
    } else if (event.target.value === 'Availability') {
      this.router.navigate([`/caregiver/profile/availability`]);
    } else if (event.target.value === 'Charges') {
      this.router.navigate([`/caregiver/profile/charges`]);
    } else if (event.target.value === 'Referral') {
      this.router.navigate([`/caregiver/profile/referral-bonus`]);
    }
  }
  redirectOnboard(event) {
    this.currentDropdownValue = event.target.value;
    if (event.target.value === 'Personal') {
      this.router.navigate([`/caregiver/onboard/personal-info`]);
    } else if (event.target.value === 'Work') {
      this.router.navigate([`/caregiver/onboard/work-info`]);
    } else if (event.target.value === 'Skillset') {
      this.router.navigate([`/caregiver/onboard/skillset`]);
    } else if (event.target.value === 'Availability') {
      this.router.navigate([`/caregiver/onboard/availability`]);
    } else if (event.target.value === 'Charges') {
      this.router.navigate([`/caregiver/onboard/charges`]);
    } else if (event.target.value === 'Documents') {
      this.router.navigate([`/caregiver/onboard/documents`]);
    } else if (event.target.value === 'Terms') {
      this.router.navigate([`/caregiver/onboard/terms-and-condition`]);
    }
  }
}
