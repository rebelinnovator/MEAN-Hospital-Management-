import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CaregiverService {
  baseUrl: any = '';

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.BASE_URL;
  }
  getUserPersonalInfo(registrationNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/personal-info/?registration_no=${registrationNo}`,
    );
  }
  getLocationList() {
    return this.httpClient.get(`${this.baseUrl}api/location`);
  }

  addUpdateCaregiverInfo(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/caregiver/personal-info`,
      data,
    );
  }
  addUpdateCaregiverWorkInfo(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/caregiver/experience-education`,
      data,
    );
  }
  getSkills(currentCaregiverType) {
    return this.httpClient.get(
      `${this.baseUrl}api/skill-set?caregiver_type=${currentCaregiverType}`,
    );
  }
  getCharges(registeredNumber) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/charges?registration_no=${registeredNumber}`,
    );
  }
  addUpdateSkillSet(data) {
    return this.httpClient.post(`${this.baseUrl}api/caregiver/skill-set`, data);
  }

  sendTermsAndConditionsMail(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/caregiver/terms-conditions`,
      data,
    );
  }

  addUpdateCharges(data) {
    return this.httpClient.post(`${this.baseUrl}api/caregiver/charges`, data);
  }

  getSkillSet(registrationNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/skill-set?registration_no=${registrationNo}`,
    );
  }
  addUpdateAvailability(data) {
    return this.httpClient.post(
      `${this.baseUrl}api/caregiver/availability`,
      data,
    );
  }
  getWorkInfo(registrationNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/experience-education?registration_no=${registrationNo}`,
    );
  }
  getAvailability(registrationNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/availability/?registration_no=${registrationNo}`,
    );
  }
  getProfileOverviewDetails(registrationNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/profile/overview?registration_no=${registrationNo}`,
    );
  }
  getProfileInfoDetails(registrationNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/profile/info?registration_no=${registrationNo}`,
    );
  }
  getProfileReviewDetails(params?) {
    return this.httpClient.get(`${this.baseUrl}api/caregiver/profile/reviews`, {
      params,
    });
  }
  getProfileAvailabilityDetails(registrationNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/profile/availability/?registration_no=${registrationNo}`,
    );
  }
  changePassword(data) {
    return this.httpClient.put(
      `${this.baseUrl}api/caregiver/profile/change-password`,
      data,
    );
  }
  searchCaregiver(data) {
    return this.httpClient.post(`${this.baseUrl}api/search-caregivers`, data);
  }
  getSystemSettings() {
    return this.httpClient.get(`${this.baseUrl}api/setting`);
  }
  addBooking(data) {
    return this.httpClient.post(`${this.baseUrl}api/booking`, data);
  }

  // Referral Bonus
  getReferralBonus(regNo) {
    return this.httpClient.get(
      `${this.baseUrl}api/caregiver/referral-bonus/?for=caregiver&registration_no=${regNo}`,
    );
  }

  // Booking
  acceptBooking(data) {
    return this.httpClient.post(`${this.baseUrl}api/booking/accept`, data);
  }
  rejectBooking(data) {
    return this.httpClient.post(`${this.baseUrl}api/booking/reject`, data);
  }
  getClientApointmentCount(slug) {
    return this.httpClient.get(
      `${this.baseUrl}api/booking/client-open-bookings?slug=${slug}`,
    );
  }

  updateEmployerStatus(data) {
    return this.httpClient.put(
      `${this.baseUrl}api/caregiver/update-show-employer-status`,
      data,
    );
  }
}
