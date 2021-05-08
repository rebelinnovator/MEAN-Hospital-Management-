import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from 'src/app/shared/services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { GlobalService } from 'src/app/shared/services/global.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ResetPassword } from '../auth.interface';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
})
export class ConfirmEmailComponent implements OnInit {
  token: string = '';
  update: string = '';
  userTypeFromUrl: string = '';
  userTypeFromStorage: string = '';
  checkboxValidaion: string;
  checkBoxValidationCaregiver: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthServiceService,
    private toastr: ToastrService,
    private headerComponent: HeaderComponent,
    private global: GlobalService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.clearStorage();
    }, 1000);
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.userTypeFromUrl = this.route.snapshot.queryParamMap.get('user_type');
    this.update = this.route.snapshot.queryParamMap.get('update');
    const dataToSend: any = {
      token: this.token
    };
    if (this.update) {
      dataToSend.update = this.update;
    }
    this.authService.confirmEmail(dataToSend).subscribe((returnData: ResetPassword) => {
      const { success, message, data: { user_type } } = returnData;
      if (success) {
        localStorage.setItem('usertype', user_type);
      } else if (!success) {
        this.toastr.error(message);
      }
    });
  }

  clearStorage() {
    this.checkboxValidaion = localStorage.getItem('checkBoxValidation');
    this.checkBoxValidationCaregiver = localStorage.getItem('checkBoxValidationCaregiver');
    this.userTypeFromStorage = localStorage.getItem('usertype');
    localStorage.clear();
    if ((this.checkboxValidaion && this.checkboxValidaion !== '') || this.checkboxValidaion !== null) {
      localStorage.setItem('checkBoxValidation', this.checkboxValidaion);
    }
    if ((this.checkBoxValidationCaregiver && this.checkBoxValidationCaregiver !== '') || this.checkBoxValidationCaregiver !== null) {
      localStorage.setItem('checkBoxValidationCaregiver', this.checkBoxValidationCaregiver);
    }
    localStorage.setItem('usertype', this.userTypeFromStorage);
    localStorage.setItem('user_type', this.userTypeFromStorage);
    this.headerComponent.showLogin = true;
    this.headerComponent.englishName = '';
    this.headerComponent.caregiverOnBoardCompleted = '0';
    this.global.showCaregiverMyProfile = '0';
    this.headerComponent.showCaregiverMyProfile = '0';
    this.headerComponent.userType = 0;
    this.global.englishName = null;
  }

  redirection() {
    if (this.userTypeFromUrl && this.userTypeFromUrl !== null) {
      this.navigationService.navigateToLogin(this.userTypeFromUrl);
    }
  }
}
