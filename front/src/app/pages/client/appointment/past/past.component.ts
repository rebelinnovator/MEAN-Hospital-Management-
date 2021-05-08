import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/shared/services/client.service';
import { GetAppointments } from '../../client.interface';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html'
})
export class PastComponent implements OnInit {
  data: any = {};
  appointmentData: GetAppointments['data'] = [];
  slug: string = localStorage.getItem('slug');
  appointment: string = 'past';
  pendingStatus: string = 'completed';
  page = {
    recordPerPage: 10,
    totalRecords: 0,
    pages: 0,
    currentPage: 0,
  };
  ariaLabelText: string = 'Completed';
  constructor(
    private toastr: ToastrService,
    private clientService: ClientService,
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
    reqObj.pendingStatus = this.pendingStatus;
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
            if (e.cancelled_by === '1') {
              e.cancelledBy = 'Admin';
            } else if (e.cancelled_by === '2') {
              e.cancelledBy = 'Caregiver';
            } else if (e.cancelled_by === '3') {
              e.cancelledBy = 'Client';
            }
            e.statusToShow = this.getStatus(e.status, e.cancelledBy);
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

  getStatus(status, canceledBy) {
    switch (status) {
      case '1':
        return 'To be paid';
      case '2':
        return 'Paid';
      case '3':
        return 'Cancelled';
      case '4':
        if (this.pendingStatus === 'cancelled') {
          return `Cancelled by ${canceledBy}`
        } else {
          return 'Refund';
        }
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
    this.pendingStatus = status;
    this.appointmentData = [];
    this.setPage(0);
  }
  redirect(event) {
    this.updateStatus(event.target.value);
    if (event.target.value === 'completed') {
      this.ariaLabelText = 'Completed';
    } else {
      this.ariaLabelText = 'Cancelled';
    }
  }
}
