import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { CaregiverService } from '../services/caregiver.service';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
interface ApiResponse {
  message: string;
  status: number;
  success: boolean;
  data: any;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  currentLanguage: string;
  showLogin: boolean = true;
  addShowHide: boolean = false;
  addShowHideMenu: boolean = false;
  addShowRegister: boolean = false;
  addShowCareReceiver: boolean = false;
  addShowLogin: boolean = false;
  registrationNo: string = '';
  caregiverOnBoardCompleted: any = '0';
  currentOnBoardStep: any;
  userData: any = {};
  englishName: any = '';
  userType: number = 0;
  checkboxValidaion: any;
  checkBoxValidationCaregiver: any;
  loggedInUserType: number = 0;
  showCaregiverMyProfile: any;
  currentOnBoardingStep: any;
  showActive: boolean = false;
  showActiveOnboard: boolean = false;
  addShowClass: boolean = true;

  constructor(
    public global: GlobalService,
    private caregiverService: CaregiverService,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this.router.events.subscribe((event: any) => {
      if (event.urlAfterRedirects !== undefined) {
        if (
          event.urlAfterRedirects.includes('profile') &&
          !event.urlAfterRedirects.includes('profile-view')
        ) {
          this.showActive = true;
        } else if (event.urlAfterRedirects.includes('profile-view')) {
          this.showActive = false;
        } else {
          this.showActive = false;
        }
        if (event.urlAfterRedirects.includes('onboard')) {
          this.showActiveOnboard = true;
        } else {
          this.showActiveOnboard = false;
        }
      }
    });
    this.showCaregiverMyProfile = localStorage.getItem(
      'showCaregiverMyProfile',
    );
    this.registrationNo = localStorage.getItem('registeredNumber');


    if (
      localStorage.getItem('caregiverOnBoardCompleted') &&
      localStorage.getItem('caregiverOnBoardCompleted') !== ''
    ) {
      this.caregiverOnBoardCompleted = Number(
        localStorage.getItem('caregiverOnBoardCompleted'),
      );
    } else if (this.global.caregiverOnBoardCompleted === '1') {
      this.caregiverOnBoardCompleted = '1';
    } else {
      this.caregiverOnBoardCompleted = '0';
    }
    this.currentOnBoardStep = localStorage.getItem('current_step');
    if (
      localStorage.getItem('currentOnBoardingStep') &&
      Number(localStorage.getItem('currentOnBoardingStep')) > 0
    ) {
      this.currentOnBoardingStep = localStorage.getItem(
        'currentOnBoardingStep',
      );
    } else {
      this.currentOnBoardingStep = '0';
    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.englishName = localStorage.getItem('englishName');
      const tokenFromStorage = localStorage.getItem('token');
      if (
        tokenFromStorage &&
        tokenFromStorage !== '' &&
        tokenFromStorage !== undefined
      ) {
        this.showLogin = false;
      }

      if (
        localStorage.getItem('user_type') &&
        localStorage.getItem('user_type') !== '' &&
        localStorage.getItem('user_type') !== undefined &&
        localStorage.getItem('user_type') !== null &&
        localStorage.getItem('user_type') !== 'null'
      ) {
        this.userType = Number(localStorage.getItem('user_type'));
      } else {
        this.userType = 0;
      }
    }, 10);

    if (this.caregiverOnBoardCompleted === '1') {
      this.getUserPersonalInfo();
    }
  }
  getUserPersonalInfo() {
    this.caregiverService.getUserPersonalInfo(this.registrationNo).subscribe(
      (returnData: ApiResponse) => {
        const { success, data } = returnData;
        if (success) {
          this.userData = data;
        }
      }
    );
  }
  logout() {
    this.showLogin = true;
    this.englishName = '';
    this.caregiverOnBoardCompleted = '0'; // 0 ==> In complete
    this.global.showCaregiverMyProfile = '0'; // 0 ==> Dont Show
    this.showCaregiverMyProfile = '0';// 0 ==> Dont Show
    this.userType = 0;// 0 ==> No User type
    this.checkboxValidaion = localStorage.getItem('checkBoxValidation');
    this.currentLanguage = this.global.currentLanguage;
    // this.currentLanguage = localStorage.getItem('currentLanguage');
    this.checkBoxValidationCaregiver = localStorage.getItem(
      'checkBoxValidationCaregiver',
    );
    this.loggedInUserType = Number(localStorage.getItem('user_type'));
    this.global.caregiverOnBoardCompleted = '0';// 0 ==> In complete
    if (this.loggedInUserType === 2) { // 2==>  Caregiver
      this.navigationService.navigateToCaregiverLogin();

    } else if (this.loggedInUserType === 3) { // 2==>  Client
      this.navigationService.navigateToClientLogin();
    } else {
      this.navigationService.navigateToCaregiverLogin();
    }
    localStorage.clear();
    localStorage.setItem('currentLanguage', this.currentLanguage);
    if (
      (this.checkboxValidaion && this.checkboxValidaion !== '') ||
      this.checkboxValidaion !== null
    ) {
      localStorage.setItem('checkBoxValidation', this.checkboxValidaion);
    }
    if (
      (this.checkBoxValidationCaregiver &&
        this.checkBoxValidationCaregiver !== '') ||
      this.checkBoxValidationCaregiver !== null
    ) {
      localStorage.setItem(
        'checkBoxValidationCaregiver',
        this.checkBoxValidationCaregiver,
      );
    }
  }
  redirection() {
    this.userType = Number(localStorage.getItem('user_type'));
    this.navigationService.navigateToChangePassword(String(this.userType));
  }
  setShowRegister() {
    this.addShowRegister = !this.addShowRegister;
    this.addShowLogin = false;
    this.addShowCareReceiver = false;
  }
  setShowLogin() {
    this.addShowLogin = !this.addShowLogin;
    this.addShowRegister = false;
    this.addShowCareReceiver = false;
  }
  setShowCareReceiver() {
    this.addShowCareReceiver = !this.addShowCareReceiver;
    this.addShowRegister = false;
    this.addShowLogin = false;
  }
  removeShowClass() {
    const slides = document.getElementsByClassName('navbar-collapse');
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i] as HTMLElement;
      slide.classList.remove('show');
      this.addShowHide = false;
    }
  }
  showAppointmenmts() {
    const slides = document.getElementsByClassName('dropdown-menu');
    for (let i = 0; i < slides.length; i++) {
      if (i === 1) {
        const slide = slides[i] as HTMLElement;
        if (slide.classList.contains('show')) {
          slide.classList.remove('show');
        } else {
          slide.classList.add('show');
        }
      }
    }
  }

  navButtonClicked() {
    const body = document.getElementById('root');
    body.className === 'menu-open' ? body.className = '' : body.className = 'menu-open';
  }
  navButtonUnClicked() {
    const body = document.getElementById('root');
    body.className = '';
  }
}
