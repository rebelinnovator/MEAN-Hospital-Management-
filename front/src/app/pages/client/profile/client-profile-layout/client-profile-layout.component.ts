import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-profile-layout',
  templateUrl: './client-profile-layout.component.html'
})
export class ClientProfileLayoutComponent implements OnInit {
  currentUrlLink: string = '';
  currentDropdownValue: string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    const urlParts: any = this.router.url.split('/');
    if (urlParts[3]) {
      this.currentUrlLink = urlParts[3];
    }
    if (this.currentUrlLink === 'account-user-info') {
      this.currentDropdownValue = 'User';
    } else if (this.currentUrlLink === 'service-user-info') {
      this.currentDropdownValue = 'Receiver';
    } else if (this.currentUrlLink === 'service-user-background') {
      this.currentDropdownValue = 'Background';
    } else if (this.currentUrlLink === 'service-user-medical-history') {
      this.currentDropdownValue = 'Medical';
    } else if (this.currentUrlLink === 'referral-bonus') {
      this.currentDropdownValue = 'Referral';
    }
  }

  changeDropDownValueFromComponent(value) {
    this.currentDropdownValue = value;
  }

  redirect(event) {
    if (event.target.value === 'User') {
      this.router.navigate([`/client/profile/account-user-info`]);
    } else if (event.target.value === 'Receiver') {
      this.router.navigate([`/client/profile/service-user-info`]);
    } else if (event.target.value === 'Background') {
      this.router.navigate([`/client/profile/service-user-background`]);
    } else if (event.target.value === 'Medical') {
      this.router.navigate([`/client/profile/service-user-medical-history`]);
    } else if (event.target.value === 'Referral') {
      this.router.navigate([`/client/profile/referral-bonus`]);
    }
  }
}
