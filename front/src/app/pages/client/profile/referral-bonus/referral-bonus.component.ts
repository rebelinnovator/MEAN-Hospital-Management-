// Libraries
import { Component, OnInit } from '@angular/core';

// Services
import { ClientService } from 'src/app/shared/services/client.service';
import { ReferralBonus } from '../../client.interface';

@Component({
  selector: 'app-referral-bonus',
  templateUrl: './referral-bonus.component.html'
})
export class ReferralBonusComponent implements OnInit {
  userData: any = {};
  slug: string = localStorage.getItem('slug');

  constructor(
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    if (this.slug) {
      setTimeout(() => {
        this.getUserRefferalBonus();
      }, 10);
    }
  }

  getUserRefferalBonus() {
    this.clientService.getReferralBonus(this.slug).subscribe(
      (response: ReferralBonus) => {
        const { success, data } = response;
        if (success) {
          this.userData = data;
        }
      }
    );
  }
}
