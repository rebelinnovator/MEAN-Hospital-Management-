import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  baseUrl: any;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.BASE_URL;
  }

  // Locations
  getLocationsList() {
    return this.httpClient.get(`${this.baseUrl}api/location/`);
  }

  // Self Care Abilities
  getSelfcareAbilitiesList() {
    return this.httpClient.get(`${this.baseUrl}api/self-care-abilitties/`);
  }

  // Self Care Abilities
  getIllnessList() {
    return this.httpClient.get(`${this.baseUrl}api/illness/`);
  }

  // Account User Info
  getAccountUserInfo(userId) {
    return this.httpClient.get(
      `${this.baseUrl}api/client/account-user-info/?user_id=${userId}`,
    );
  }
  addUpdateAccountUserInfo(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/client/account-user-info`,
      data,
    );
  }

  // Service User Info
  getServiceUserInfo(slug) {
    return this.httpClient.get(
      `${this.baseUrl}api/client/service-user-info/?slug=${slug}`,
    );
  }
  addUpdateServiceUserInfo(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/client/service-user-info`,
      data,
    );
  }

  // Service User Background
  getServiceUserBackground(slug) {
    return this.httpClient.get(
      `${this.baseUrl}api/client/service-user-background/?slug=${slug}`,
    );
  }
  addUpdateServiceUserBackground(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/client/service-user-background`,
      data,
    );
  }

  // Service User Medical History
  getServiceUserMedicalHistory(slug) {
    return this.httpClient.get(
      `${this.baseUrl}api/client/service-user-medical-history/?slug=${slug}`,
    );
  }
  addUpdateServiceUserMedicalHistory(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/client/service-user-medical-history`,
      data,
    );
  }

  // Terms and Conditions
  getClientTermsConditions(slug) {
    return this.httpClient.get(
      `${this.baseUrl}api/client/terms-conditions/?slug=${slug}`,
    );
  }
  addUpdateClientTermsConditions(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/client/terms-conditions`,
      data,
    );
  }

  // Feedback
  addFeedback(data) {
    return this.httpClient.post(`${this.baseUrl}api/client/feedback`, data);
  }

  // Referral Bonus
  getReferralBonus(slug) {
    return this.httpClient.get(
      `${this.baseUrl}api/client/referral-bonus/?for=client&slug=${slug}`,
    );
  }

  // Appointment
  getAppointments(params?) {
    return this.httpClient.get(`${this.baseUrl}api/booking/for-client`, {
      params,
    });
  }
  cancelAppointment(data) {
    return this.httpClient.put(
      `${this.baseUrl}api/booking/cancel-by-client`,
      data,
    );
  }
}
