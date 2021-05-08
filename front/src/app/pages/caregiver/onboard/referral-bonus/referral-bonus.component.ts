// Libraries
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// Services
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { GetReferralBonus } from '../../caregiver.interface';
interface ApiResponse {
  message: string;
  status: number;
  success: boolean;
  data: object;
}

@Component({
  selector: 'app-referral-bonus',
  templateUrl: './referral-bonus.component.html',
})
export class ReferralBonusComponent implements OnInit {
  userData: any;
  regNo: string = localStorage.getItem('registeredNumber');
  constructor(
    private toastr: ToastrService,
    private caregiverService: CaregiverService,
  ) { }

  ngOnInit(): void {
    if (this.regNo) {
      this.getUserRefferalBonus();
    }
  }

  getUserRefferalBonus() {
    this.caregiverService.getReferralBonus(this.regNo).subscribe(
      (response: GetReferralBonus) => {
        const { success, data } = response;
        if (success) {
          this.userData = data;
        }
      }
    );
  }
}
