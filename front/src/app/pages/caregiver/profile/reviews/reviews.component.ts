// Libraries
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { GetProfileReviewDetails } from '../../caregiver.interface';
interface ApiResponse {
  message: string;
  status: number;
  success: boolean;
  data: any;
}
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent implements OnInit {
  data: any = {};
  userData: any = [];
  regNo: number;
  page = {
    recordPerPage: 4,
    totalRecords: 0,
    pages: 0,
    currentPage: 0,
    orderDir: 'desc',
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private caregiverService: CaregiverService,
  ) { }

  ngOnInit(): void {
    this.regNo = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.regNo) {
      this.setPage(0);
    }
  }

  setPage(pageInfo) {
    this.page.currentPage = pageInfo;
    const reqObj: any = {
      recordPerPage: this.page.recordPerPage,
      pageNumber: this.page.currentPage + 1,
      orderDir: this.page.orderDir,
    };
    reqObj.registration_no = this.regNo;
    this.caregiverService.getProfileReviewDetails(reqObj).subscribe(
      (response: GetProfileReviewDetails) => {
        const { success, data } = response;
        if (success) {
          this.data = data;
          this.data.currentPage = Number(this.data.currentPage);
          if (this.userData.length) {
            this.userData.push(...response.data.data);
          } else {
            this.userData = data.data;
          }
          this.userData.map(e => {
            e.status = this.getReviewStatus(e.rating.toString());
          });
        }
      },
      err => {
        this.data = {};
        this.userData = [];
      },
    );
  }

  getReviewStatus(rating) {
    switch (rating) {
      case '1':
        return 'Hate It';
      case '1.5':
        return 'Hate It';
      case '2':
        return 'Don\'t Like It';
      case '2.5':
        return 'Don\'t Like It';
      case '3':
        return 'Ok';
      case '3.5':
        return 'Ok';
      case '4':
        return 'Like It';
      case '4.5':
        return 'Like It';
      case '5':
        return 'Love It';
    }
  }

  changeSorting(event) {
    if (event.target.value === 'new') {
      this.page.orderDir = 'desc';
    } else if (event.target.value === 'old') {
      this.page.orderDir = 'asc';
    }
    this.userData = [];
    this.setPage(0);
  }
}
