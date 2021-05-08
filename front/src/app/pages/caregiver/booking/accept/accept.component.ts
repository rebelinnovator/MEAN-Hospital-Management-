// Libraries
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

// Services
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { ApiResponse } from '../../caregiver.interface';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html'
})
export class AcceptComponent implements OnInit {
  isResponse: boolean = false;
  regNo: string = localStorage.getItem('registeredNumber');
  bookingId: string;
  constructor(
    private router: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private caregiverService: CaregiverService,
    private navigationService: NavigationService,
    private toastr: ToastrService,
    private constantService: ConstantService,
    private translate: TranslateService
  ) {
    this.bookingId = this.router.snapshot.queryParamMap.get('booking_id');
  }

  ngOnInit(): void {
    if (this.bookingId) {
      setTimeout(() => {
        this.acceptBooking();
      }, 100);
    }
  }

  acceptBooking() {
    const reqObj = {
      payload: this.bookingId,
    };
    this.spinner.show();
    this.caregiverService.acceptBooking(reqObj).subscribe(
      (response: ApiResponse) => {
        const { success } = response;
        if (success) {
          this.isResponse = true;
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        if (err.message === 'Booking already accepted by the caregiver') {
          this.navigationService.navigateToOtherAccepted();
        } else if (err.message === 'Booking not found') {
          this.toastr.error(this.translate.instant(this.constantService.OTHER_CAREGIVER_BOOKING));
          this.navigationService.navigateToHome();
        } else {
          this.toastr.error(this.translate.instant(err.message));
          this.navigationService.navigateToHome();
        }
      },
    );
  }
}