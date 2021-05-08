import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-confirmed',
  templateUrl: './booking-confirmed.component.html',
})
export class BookingConfirmedComponent implements OnInit {
  caregiverType: string = localStorage.getItem('currentCaregiverType');

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
