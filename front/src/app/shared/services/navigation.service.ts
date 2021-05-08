import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    clientSteps = {
        accountInfo: '1',
        serviceInfo: '2',
        background: '3',
        medicalHistory: '4',
        terms: '5',
        thanks: '6',
    }
    caregiverSteps = {
        onboardCompleted: '0',
        personalInfo: '1',
        workInfo: '2',
        skillSet: '3',
        availability: '4',
        charges: '5',
        documents: '6',
        terms: '7',
        thanks: '8',
    }
    onboardAction = 'onboard';
    profileAction = 'profile';
    caregiverLogin = '/auth/caregiver-login'
    clientLogin = '/auth/client-login'
    homePage = '/auth/client-login'
    bookingConfirmed = '/pages/caregiver/booking-confirmed'
    constructor(private router: Router) { }

    // for navigating client
    navigateClient(action, step?) {
        if (action === this.onboardAction) {
            switch (step.toString()) {
                case '1':
                    this.router.navigate(['/client/onboard']);
                    break;
                case '2':
                    this.router.navigate(['/client/onboard/service-info']);
                    break;
                case '3':
                    this.router.navigate(['/client/onboard/background']);
                    break;
                case '4':
                    this.router.navigate(['/client/onboard/medical-history']);
                    break;
                case '5':
                    this.router.navigate(['/client/onboard/terms-conditions']);
                    break;
                case '6':
                    this.router.navigate(['/client/onboard/thank-you']);
                    break;
            }
        } else {
            if (!step) {
                this.router.navigate(['client/profile']);
            } else {
                switch (step.toString()) {
                    case '1':
                        this.router.navigate(['client/profile/account-user-info']);
                        break;
                    case '2':
                        this.router.navigate(['client/profile/service-user-info']);
                        break;
                    case '3':
                        this.router.navigate(['client/profile/service-user-background']);
                        break;
                    case '4':
                        this.router.navigate(['client/profile/service-user-medical-history']);
                        break;
                    case '5':
                        this.router.navigate(['/client/profile/referral-bonus']);
                        break;
                }
            }
        }
    }
    // for navigating caregiver
    navigateCaregiver(action, step?) {
        if (action === this.onboardAction) {
            switch (step.toString()) {
                case '1':
                    this.router.navigate(['/caregiver/onboard/personal-info']);
                    break;
                case '2':
                    this.router.navigate(['/caregiver/onboard/work-info']);
                    break;
                case '3':
                    this.router.navigate(['/caregiver/onboard/skillset']);
                    break;
                case '4':
                    this.router.navigate(['/caregiver/onboard/availability']);
                    break;
                case '5':
                    this.router.navigate(['/caregiver/onboard/charges']);
                    break;
                case '6':
                    this.router.navigate(['/caregiver/onboard/documents']);
                    break;
                case '7':
                    this.router.navigate(['/caregiver/onboard/terms-and-condition']);
                    break;
                case '8':
                    this.router.navigate(['/caregiver/onboard/thankyou']);
                    break;
            }
        } else {
            if (!step) {
                this.router.navigate(['caregiver/profile']);
            } else {
                switch (step.toString()) {
                    case '1':
                        this.router.navigate(['/caregiver/profile/personal-info']);
                        break;
                    case '2':
                        this.router.navigate(['/caregiver/profile/work-info']);
                        break;
                    case '3':
                        this.router.navigate(['/caregiver/profile/skillset']);
                        break;
                    case '4':
                        this.router.navigate(['/caregiver/profile/availability']);
                        break;
                    case '5':
                        this.router.navigate(['/caregiver/profile/charges']);
                        break;
                    case '6':
                        this.router.navigate(['/caregiver/profile/referral-bonus']);
                        break;
                }
            }
        }
    }
    navigateWithData(data) {
        this.router.navigateByUrl(`/pages/caregiver/search/${data}`);
    }
    navigateWithDataToLogin(data) {
        this.router.navigateByUrl(`/auth/client-login/${data}`);
    }
    navigateToLogin(userType) {
        if (userType === '2') {
            this.router.navigateByUrl(`/auth/caregiver-login`);
        } else if (userType === '3') {
            this.router.navigateByUrl(`/auth/client-login`);
        }
    }
    navigateToChangePassword(userType) {
        if (userType === '2') {
            this.router.navigateByUrl(`/pages/caregiver-change-password`);
        } else if (userType === '3') {
            this.router.navigateByUrl(`pages/client-change-password`);
        }
    }
    navigateToHome() {
        this.router.navigateByUrl(`/`);
    }
    navigateToForgotPassword() {
        this.router.navigateByUrl(`/auth/forgot-password`);
    }
    navigateToOtherAccepted() {
        this.router.navigateByUrl(`/caregiver/booking/already-accepted-by-other-caregiver`);
    }
    navigateToClientLogin() {
        this.router.navigateByUrl(`/auth/client-login`);
    }
    navigateToClientLoginWithParams(params) {
        this.router.navigate(['/auth/client-login'], { queryParams: { redirectURL: params } });
    }
    navigateToCaregiverLogin() {
        this.router.navigateByUrl(`/caregiver-login`);
    }
}