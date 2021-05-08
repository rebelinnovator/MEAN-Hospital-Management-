import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css'],
})
export class ClientLayoutComponent implements OnInit {
  currentUrlLink: string = '';
  currentDropdownValue: string = '';
  constructor(public global: GlobalService, public router: Router) { }

  ngOnInit(): void {
    const urlParts: any = this.router.url.split('/');
    if (urlParts[3]) {
      this.currentUrlLink = urlParts[3];
    }
    if (this.currentUrlLink === 'user-info') {
      this.currentDropdownValue = 'User';
    } else if (this.currentUrlLink === 'service-info') {
      this.currentDropdownValue = 'Receiver';
    } else if (this.currentUrlLink === 'background') {
      this.currentDropdownValue = 'Background';
    } else if (this.currentUrlLink === 'medical-history') {
      this.currentDropdownValue = 'Medical';
    } else if (this.currentUrlLink === 'terms-conditions') {
      this.currentDropdownValue = 'Terms';
    }
  }

  changeDropDownValueFromComponent(value) {
    this.currentDropdownValue = value;
  }

  redirect(event) {
    if (event.target.value === 'User') {
      this.router.navigate([`/client/onboard/user-info`]);
    } else if (event.target.value === 'Receiver') {
      this.router.navigate([`/client/onboard/service-info`]);
    } else if (event.target.value === 'Background') {
      this.router.navigate([`/client/onboard/background`]);
    } else if (event.target.value === 'Medical') {
      this.router.navigate([`/client/onboard/medical-history`]);
    } else if (event.target.value === 'Terms') {
      this.router.navigate([`/client/onboard/terms-conditions`]);
    }
  }
}
