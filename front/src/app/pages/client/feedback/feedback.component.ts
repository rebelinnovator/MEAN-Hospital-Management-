// Libraries
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// Services
import { GlobalService } from 'src/app/shared/services/global.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { ConstantService } from 'src/app/shared/services/constant.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ApiResponse } from '../client.interface';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit {
  regularForm: FormGroup;
  userData: any = {};
  slug: string = localStorage.getItem('slug');
  bookingId: string;
  constructor(
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private globalService: GlobalService,
    private clientService: ClientService,
    private constant: ConstantService,
    private navigationService: NavigationService,
    private translate: TranslateService,
  ) {
    this.bookingId = this.router.snapshot.queryParamMap.get('booking');
  }

  ngOnInit(): void {
    this.setForm();
    this.regularForm.patchValue({
      booking_id: this.bookingId,
    });
  }

  setForm() {
    this.regularForm = new FormGroup({
      booking_id: new FormControl('', []),
      rating: new FormControl('', [Validators.required]),
      positive_feedback: new FormControl('', [Validators.maxLength(250)]),
      negative_feedback: new FormControl('', [Validators.maxLength(250)]),
    });
  }

  onReactiveFormSubmit() {
    if (!this.regularForm.valid) {
      this.toastr.error(this.constant.CHOOSE_RATING);
      return false;
    }
    this.clientService.addFeedback(this.regularForm.value).subscribe(
      (response: ApiResponse) => {
        const { success, message } = response;
        if (success) {
          this.toastr.success(this.translate.instant(message));
          this.navigationService.navigateToHome();
        }
      },
      error => {
        if (error.status === 400) {
          this.globalService.errorHandling(error, this.regularForm);
        } else {
          this.toastr.error(error.message);
          this.navigationService.navigateToHome();
        }
      },
    );
  }
}
