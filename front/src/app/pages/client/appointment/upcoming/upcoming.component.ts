import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/shared/services/client.service';
import { GetAppointments } from '../../client.interface';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html'
})
export class UpcomingComponent implements OnInit {
  data: any = {};
  appointmentData: GetAppointments['data'] = [];
  slug: string = localStorage.getItem('slug');
  appointment: string = 'upcoming';
  upcomingStatus: string = 'confirmed';
  page = {
    recordPerPage: 10,
    totalRecords: 0,
    pages: 0,
    currentPage: 0,
  };
  ariaLabelText: string = 'Confirmed';
  constructor(
    private toastr: ToastrService,
    private clientService: ClientService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.setPage(0);
  }

  setPage(pageInfo) {
    this.page.currentPage = pageInfo;
    const reqObj: any = {
      recordPerPage: this.page.recordPerPage,
      pageNumber: this.page.currentPage + 1,
    };
    reqObj.slug = this.slug;
    reqObj.appointment = this.appointment;
    reqObj.upcomingStatus = this.upcomingStatus;
    this.clientService.getAppointments(reqObj).subscribe(
      (response: GetAppointments) => {
        const { success, data } = response;
        if (success) {
          this.data = data;
          this.data.currentPage = Number(this.data.currentPage);
          if (this.appointmentData.length) {
            this.appointmentData.push(...data['data']);
          } else {
            this.appointmentData = data['data'];
          }
          this.appointmentData.map(e => {
            e.statusToShow = this.getStatus(e.status);
            e.caregiverDetail[0].caregiver.caregiver_type = this.getCaregiverType(
              e.caregiverDetail[0].caregiver.caregiver_type,
            );
          });
        }
      },
      err => {
        this.toastr.error(err.message);
      },
    );
  }

  getStatus(status) {
    switch (status) {
      case '1':
        return 'To be paid';
      case '2':
        return 'Paid';
      case '3':
        return 'Cancelled';
      case '4':
        return 'Refund';
    }
  }

  getCaregiverType(type) {
    switch (type) {
      case '1':
        return 'Registered Nurse';
      case '2':
        return 'Enrolled Nurse';
      case '3':
        return 'Health Worker';
      case '4':
        return 'Personal Care Worker';
      case '5':
        return 'Out-Patient Escort Person';
    }
  }

  updateStatus(status) {
    this.upcomingStatus = status;
    this.appointmentData = [];
    this.setPage(0);
  }

  cancelBooking(bookingId) {
    Swal.fire({
      title: this.translate.instant('Are you sure you\'d like to cancel the appointment?'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(result => {
      if (result.value) {
        const reqObj: any = {
          slug: this.slug,
          booking_id: bookingId,
        };
        this.clientService.cancelAppointment(reqObj).subscribe(
          (response: any) => {
            if (response.success === true) {
              this.toastr.success(this.translate.instant(response.message));
              this.appointmentData = this.appointmentData.filter(
                item => item.booking_id !== bookingId,
              );
            }
          },
          err => {
            this.toastr.error(err.message);
          },
        );
      }
    });
  }
  redirect(event) {
    this.updateStatus(event.target.value);
    if (event.target.value === 'confirmed') {
      this.ariaLabelText = 'Confirmed';
    } else {
      this.ariaLabelText = 'Pending';
    }
  }
}
