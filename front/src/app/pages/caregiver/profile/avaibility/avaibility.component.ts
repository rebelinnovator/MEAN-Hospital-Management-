import { Component, OnInit } from '@angular/core';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { ActivatedRoute } from '@angular/router';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { GetAvailability } from '../../caregiver.interface';

@Component({
  selector: 'app-avaibility',
  templateUrl: './avaibility.component.html',
})
export class AvaibilityComponent implements OnInit {
  registrationNo: number;
  days: Array<string> = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  availabilityArray: any = [];
  locationsArray: any = [];
  moment: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private caregiverService: CaregiverService,
  ) {
    this.moment = extendMoment(Moment);
  }

  ngOnInit(): void {
    this.registrationNo = Number(
      this.activatedRoute.snapshot.paramMap.get('id'),
    );
    this.getProfileAvailabilityDetails();
  }
  getProfileAvailabilityDetails() {
    this.caregiverService
      .getProfileAvailabilityDetails(this.registrationNo)
      .subscribe((returnData: GetAvailability) => {
        const { success, data } = returnData;
        if (success) {
          const { availability, locations } = data;
          this.availabilityArray = availability;
          this.locationsArray = locations;
          if (this.availabilityArray.length > 0) {
            this.availabilityArray.map((availabilityInner: any) => {
              availabilityInner.from_time = this.moment(availabilityInner.from_time, 'HH:mm').format('hh:mm A')
              if (availabilityInner.to_time === '23:59') {
                availabilityInner.to_time = '12:00 AM'
              } else {
                availabilityInner.to_time = this.moment(availabilityInner.to_time, 'HH:mm').format('hh:mm A')
              }
            })
          }
        }
      });
  }
}
