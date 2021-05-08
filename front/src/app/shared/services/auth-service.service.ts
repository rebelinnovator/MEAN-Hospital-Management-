import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  type = 0;
  baseUrl: any = '';
  // isLoggedIn: boolean = true
  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.BASE_URL;
  }
  isLoggedIn() {
    const tokenFromStorage = localStorage.getItem('token');
    if (
      tokenFromStorage &&
      tokenFromStorage !== '' &&
      tokenFromStorage !== undefined
    ) {
      return true;
    } else {
      return false;
    }
  }
  registerCaregiver(data) {
    return this.httpClient.post(`${this.baseUrl}api/auth/register`, data);
  }

  confirmEmail(token) {
    return this.httpClient.put(
      `${this.baseUrl}api/auth/confirm-email?token`,
      token,
    );
  }

  caregiverLogin(data) {
    return this.httpClient.post(`${this.baseUrl}api/auth/login`, data);
  }

  forgotPassword(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/auth/forgot-password`,
      data,
    );
  }

  resetPassword(data) {
    return this.httpClient.put(`${this.baseUrl}api/auth/reset-password`, data);
  }

  resendForgotPasswordMail(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/auth/resend-forgot-password`,
      data,
    );
  }
  activateAccountMailSendAgain(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/auth/resend-confirm-email`,
      data,
    );
  }
  setGetType(type: number) {
    this.type = type;
  }
  getType() {
    return this.type;
  }

  // Redirect client on onboarding steps / profile based on his competion of data
  redirectClient() {
    const slug = localStorage.getItem('slug');
    const currentStep = localStorage.getItem('current_step');

    if (!slug && !currentStep) {
      return '/client/onboard/user-info';
    } else if (currentStep === '1') {
      return '/client/onboard/user-info';
    } else if (currentStep === '2') {
      return '/client/onboard/service-info';
    } else if (currentStep === '3') {
      return '/client/onboard/background';
    } else if (currentStep === '4') {
      return '/client/onboard/medical-history';
    } else if (currentStep === '5') {
      return '/client/onboard/terms-conditions';
    } else {
      return '/client/profile';
    }
  }
}
