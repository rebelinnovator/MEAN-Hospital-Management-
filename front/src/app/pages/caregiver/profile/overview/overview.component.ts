import { Component, OnInit } from '@angular/core';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { ActivatedRoute } from '@angular/router';
import { GetProfileOverviewDetails } from '../../caregiver.interface';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  registrationNo: number;
  overviewDetails: any = {};
  languagesArray: any = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private caregiverService: CaregiverService,
    private translate: TranslateService
  ) { }
  ngOnInit(): void {
    this.registrationNo = Number(
      this.activatedRoute.snapshot.paramMap.get('id'),
    );
    this.getProfileOverviewDetails();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getProfileOverviewDetails();
    })
  }
  getProfileOverviewDetails() {
    this.caregiverService
      .getProfileOverviewDetails(this.registrationNo)
      .subscribe((returnData: GetProfileOverviewDetails) => {
        const { success, data } = returnData;
        if (success) {
          this.overviewDetails = data;
          this.overviewDetails.caregiver_type = this.getCaregiverType(this.overviewDetails.caregiver_type);
          this.overviewDetails.languages.map(e => {
            if (e.language !== '4') { // 4==> Other Selected
              e.language = this.getLanguage(e.language);
            } else {
              e.language = e.other_lang;
            }
          });
          this.overviewDetails.avgRating = this.overviewDetails.avg_rating;
        }
      });
  }

  getLanguage(lang) {
    switch (lang) {
      case '1':
        return this.translate.instant('Cantonese');
      case '2':
        return this.translate.instant('Mandarin');
      case '3':
        return this.translate.instant('English');
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
}
