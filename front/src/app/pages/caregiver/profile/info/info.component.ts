import { Component, OnInit } from '@angular/core';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { GetProfileInfoDetails } from '../../caregiver.interface';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
})
export class InfoComponent implements OnInit {
  registrationNo: number;
  personalCareArray: any = [];
  specialCareArray: any = [];
  employerArray: any = [];
  currentEmployer: any = {};
  previousEmployerArray: any = [];
  workType: Array<string> = ['Full time', 'Part time'];
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  currentEmployerSpanYear: number;
  currentEmployerSpanMonth: number;
  currentEmployerSpanDays: number;
  previousEmployerYearSpan: any = [];
  showCurrentEmployerEmpty: boolean = false;
  yearsOfExperience: number;
  monthsOfExperience: number;
  caregiverType: string;
  showEmployer: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private caregiverService: CaregiverService,
    private global: GlobalService
  ) { }

  ngOnInit(): void {
    this.registrationNo = Number(
      this.activatedRoute.snapshot.paramMap.get('id'),
    );
    this.getDate();
    this.getProfileInfoDetails();
  }
  getDate() {
    const currentTime = new Date();
    this.currentMonth = currentTime.getMonth() + 1;
    this.currentDay = currentTime.getDate();
    this.currentYear = currentTime.getFullYear();
  }
  calculateExperience(fromMonth, fromYear) {
    const currentDate = new Date();
    let inputDate: any;
    inputDate = new Date(fromYear, fromMonth - 1, 1);
    let dy = currentDate.getFullYear() - inputDate.getFullYear();
    let dm = currentDate.getMonth() - inputDate.getMonth();
    if (dm < 0) {
      dy -= 1;
      dm += 12;
    }
    this.yearsOfExperience = Number(dy);
    this.monthsOfExperience = Number(dm);
  }
  getProfileInfoDetails() {
    this.caregiverService
      .getProfileInfoDetails(this.registrationNo)
      .subscribe((returnData: GetProfileInfoDetails) => {
        const { success, data } = returnData;
        if (success) {
          const { skills, employer, caregiver_type, show_employer_option } = data;
          this.caregiverType = caregiver_type;
          this.showEmployer = show_employer_option;
          for (let i = 0; i <= skills.length - 1; i++) {
            const { english_title, type } = skills[i];
            if (type === this.global.personalCareType) {
              this.personalCareArray.push(english_title);
            } else if (type === this.global.specialCareType) {
              this.specialCareArray.push(english_title);
            }
          }
          this.employerArray = employer;
          for (let i = 0; i <= this.employerArray.length - 1; i++) {
            if (this.employerArray[i].is_current_employer === '1') {
              this.currentEmployer = this.employerArray[i];
              this.calculateExperience(
                this.employerArray[i].from_month,
                this.employerArray[i].from_year,
              );
            } else {
              this.previousEmployerArray.push(this.employerArray[i]);
            }
          }
          this.setPreviousEmployeeExperience();
        }
        if (this.isEmpty(this.currentEmployer)) {
          this.showCurrentEmployerEmpty = true;
        }
        for (let i = 0; i <= this.previousEmployerArray.length - 1; i++) {
          if (this.previousEmployerArray[i].to_year - this.previousEmployerArray[i].from_year > 0) {
            this.previousEmployerYearSpan.push(
              this.previousEmployerArray[i].to_year -
              this.previousEmployerArray[i].from_year,
            );
          }
        }
      });
  }
  setPreviousEmployeeExperience() {
    if (this.previousEmployerArray.length > 0) {
      this.previousEmployerArray.map((previous: any) => {
        const { from_year, to_year, from_month, to_month, } = previous;
        const fromDate = new Date(from_year, from_month - 1, 1);
        const toDate = new Date(to_year, to_month - 1, 1);
        let dy = toDate.getFullYear() - fromDate.getFullYear();
        let dm = toDate.getMonth() - fromDate.getMonth();
        if (dm < 0) {
          dy -= 1;
          dm += 12;
        }
        previous.years_experience = dy;
        previous.months_experience = dm;
      });
    }
  }
  isEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }
}
