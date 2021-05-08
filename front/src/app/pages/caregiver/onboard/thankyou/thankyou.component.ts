import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
})
export class ThankyouComponent implements OnInit {
  constructor(private navigationService: NavigationService, public global: GlobalService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.navigationService.navigateToHome();
    }, 10000);
  }
}
