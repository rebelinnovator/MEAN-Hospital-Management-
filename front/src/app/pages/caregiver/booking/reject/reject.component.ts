// Libraries
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

// Services
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { ApiResponse } from '../../caregiver.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html'
})
export class RejectComponent implements OnInit {
  isResponse: boolean = false;
  regNo: string = localStorage.getItem('registeredNumber');
  bookingId: string;
  constructor(
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private caregiverService: CaregiverService,
    private navigationService: NavigationService,
    private constantService: ConstantService,
    private translate: TranslateService
  ) {
    this.bookingId = this.router.snapshot.queryParamMap.get('booking_id');
  }

  ngOnInit(): void {
    if (this.bookingId) {
      setTimeout(() => {
        this.rejectBooking();
      }, 100);
    }
  }

  rejectBooking() {
    const reqObj = {
      payload: this.bookingId,
    };
    this.spinner.show();
    this.caregiverService.rejectBooking(reqObj).subscribe(
      (response: ApiResponse) => {
        const { success } = response;
        if (success) {
          this.isResponse = true;
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        if (err.message === 'Booking not found') {
          this.toastr.error(this.translate.instant(this.constantService.OTHER_CAREGIVER_BOOKING));
        } else if (err.message === 'Booking already accepted by the caregiver') {
          this.isResponse = true;
        } else {
          this.navigationService.navigateToHome();
          this.toastr.error(this.translate.instant(err.message));
        }
      },
    );
  }
}
