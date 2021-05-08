import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../shared/services/global.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
})
export class DocumentsComponent implements OnInit {
  currentStepFromStorage: string;
  constructor(
    private global: GlobalService,
    private navigationService: NavigationService,
    private layoutComponent: LayoutComponent
  ) {
    this.currentStepFromStorage = localStorage.getItem('currentOnBoardingStep');
  }

  ngOnInit(): void { }
  redirection() {
    localStorage.setItem('currentOnBoardingStep', this.navigationService.caregiverSteps.terms);
    if (Number(this.currentStepFromStorage) > Number(this.navigationService.caregiverSteps.documents)) {
      this.global.currentOnBoardStep = this.currentStepFromStorage;
    } else {
      this.global.currentOnBoardStep = Number(this.navigationService.caregiverSteps.documents);
    }
    const step = this.navigationService.caregiverSteps.terms;
    this.layoutComponent.changeDropDownValueFromComponent('Terms');
    this.navigationService.navigateCaregiver(this.navigationService.onboardAction, step);
  }
  redirectionPrevious() {
    const step = this.navigationService.caregiverSteps.charges;
    this.layoutComponent.changeDropDownValueFromComponent('Charges');
    this.navigationService.navigateCaregiver(this.navigationService.onboardAction, step);
  }
}
