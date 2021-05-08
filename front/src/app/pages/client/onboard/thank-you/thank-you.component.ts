import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/shared/services/global.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html'
})
export class ThankYouComponent implements OnInit {

  constructor(private globalService: GlobalService, private navigationService: NavigationService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.globalService.currentOnBoardStep = null;
      this.globalService.currentStep = null;
      localStorage.setItem('current_step', null);
      this.navigationService.navigateToHome();
    }, 10000);
  }

}