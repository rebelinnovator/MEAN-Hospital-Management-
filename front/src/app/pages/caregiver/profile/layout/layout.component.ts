import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutProfileComponent implements OnInit {
  id = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const urlParts: any = this.router.url.split('/');
    if (urlParts[5]) {
      this.id = Number(urlParts[5]);
    }
  }
  redirect(event) {
    if (event.target.value === 'Overview') {
      this.router.navigate([`/pages/caregiver/profile-view/overview/${this.id}`]);
    } else if (event.target.value === 'Info') {
      this.router.navigate([`/pages/caregiver/profile-view/info/${this.id}`]);
    } else if (event.target.value === 'Reviews') {
      this.router.navigate([`/pages/caregiver/profile-view/review/${this.id}`]);
    } else if (event.target.value === 'Availability') {
      this.router.navigate([`/pages/caregiver/profile-view/availability/${this.id}`]);
    }
  }
}
