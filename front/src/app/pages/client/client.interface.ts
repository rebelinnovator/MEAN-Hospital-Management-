export interface ApiResponse {
    message: string;
    status: number;
    success: boolean;
}

// Locations, SelfcareAbilities
export interface SeederResponse {
    message: string;
    status: number;
    success: boolean;
    data: Array<object>;
}

// UserData
export interface UserData {
    'id': number;
    'salute': string;
    'email': string;
    'preferred_communication_language': string;
    'mobile_number': string;
    'is_deleted': boolean;
}

// Account User Info
export interface GetAccountUserInfo {
    message: string;
    status: number;
    success: boolean;
    data: AccountUser;
}

export interface AccountUser extends UserData {
    'id': number;
    'first_name': string;
    'last_name': string;
    'slug': string;
    'home_telephone_number': string;
    'relation_with_service_user': string;
    'user_id': number;
    'user': UserData;
}

export interface PostAccountUserInfo {
    message: string;
    status: number;
    success: boolean;
    data: string;
}


// Service User Info
export interface GetServiceUserInfo {
    message: string;
    status: number;
    success: boolean;
    data: ServiceUser;
}

export interface ServiceUser extends UserData {
    'id': number;
    'user_id': number;
    'slug': string;
    'service_user_salute': string;
    'service_user_firstname': string;
    'service_user_lastname': string;
    'service_user_dob': string;
    'servive_user_home_telephone': string;
    'service_user_mobile': string;
    'service_user_flat_no': string
    'service_user_floor_no': string;
    'service_user_building_name': string;
    'service_user_street_name_number': string;
    'service_user_district': string;
    'user': UserData;
}

// Service User Background
export interface GetServiceUserBackground {
    message: string;
    status: number;
    success: boolean;
    data: ServiceUserBackground;
}

export interface ServiceUserBackground extends UserData {
    'id': number;
    'slug': string
    'service_user_weight': number;
    'service_user_height': number;
    'service_user_lastname': string;
    'service_user_diet': string;
    'service_user_physical_ability': string;
    'service_user_eye_sight': string;
    'service_user_hearing': string;
    'service_user_lifting': string;
    'service_user_lifting_specific': string;
    'service_user_lower_left_leg_limb_mobility': string;
    'service_user_lower_right_leg_limb_mobility': string;
    'service_user_left_hand_mobility': string;
    'service_user_right_hand_mobility': string;
    'service_user_assisting_device': string;
    'otherDevices': Array<OtherDevices>;
    'selfCareAbilities': Array<SelfcareAbilities>;
    'languages': Array<Languages>;
}

export interface OtherDevices {
    'id': number;
    'client_id': number;
    'other_device': string;
    'specific_drug': string;
    'created_at': string;
    'updated_at': string;
}

export interface SelfcareAbilities {
    'id': number;
    'name': string;
    'parent_id': number;
    'created_at': string;
    'updated_at': string;
    'pivot': object;
}

export interface Languages {
    'id': number;
    'client_id': number;
    'language': string;
    'other_lang': string;
    'created_at': string;
    'updated_at': string;
}

// Medical History
export interface GetServiceUserMedHistory {
    message: string;
    status: number;
    success: boolean;
    data: MedicalHistory;
}

export interface MedicalHistory {
    'id': number;
    'slug': string;
    'service_user_other_medical_history': string;
    'illness': Array<Illness>
}

export interface Illness {
    'id': number;
    'english_title': string;
    'is_specific': boolean;
    'pivot': SpecificTitle;
}

export interface SpecificTitle {
    'specific_title': string;
}

export interface IllnessList {
    message: string;
    status: number;
    success: boolean;
    data: Array<IllnessData>;
}

export interface IllnessData {
    'id': number;
    'english_title': string;
    'is_specific': number;
    'children': Array<IllnessChild>;
    'selected': boolean;
}

export interface IllnessChild {
    'id': number;
    'english_title': string;
    'parent_id': number;
    'is_specific': number;
    'selected': boolean;
}

// Referral Bonus
export interface ReferralBonus {
    message: string;
    status: number;
    success: boolean;
    data: Referrals;
}

export interface Referrals {
    'due': number;
    'earned': number;
    'paid': number;
    'caregivers_reffered': number;
}

// Terms & Conditions
export interface TnC {
    message: string;
    status: number;
    success: boolean;
    data: TnCDetails;
}

export interface TnCDetails {
    'slug': string;
    'hkid_name': string;
    'tnc_accepted_date': string;
}

// Previous Appointments
export interface GetAppointments {
    message: string;
    status: number;
    success: boolean;
    totalRecords: number;
    currentPage: string;
    recordPerPage: string;
    previous: string;
    pages: number;
    next: string;
    data: Array<AppointmentData>;
}

export interface AppointmentData {
    'id': number;
    'booking_id': string;
    'client_id': number;
    'date': string;
    'start_time': string;
    'end_time': string;
    'duration': number;
    'transport_subsidy': number;
    'cancelled_by': string;
    'status': string;
    'payment_status': string;
    'payment_status_caregiver': string;
    'payment_date_caregiver': string;
    'payment_date_client': string;
    'receipt_number': string;
    'created_at': string;
    'updated_at': string;
    'services': Array<Services>;
    'caregiverDetail': Array<CaregiverDetail>;
    'client': Client;
    'statusToShow': string;
    'cancelledBy': string;
}

export interface Services {
    'id': number;
    'english_title': string;
    'pivot': object;
}

export interface CaregiverDetail {
    'id': number;
    'caregiver_booking_id': number;
    'caregiver_id': number;
    'caregiver_charges_hour': number;
    'caregiver_charges_price': number;
    'total_amount': number;
    'caregiver_charges': number;
    'caregiver_service_fee': number;
    'client_service_fee': number;
    'status': string;
    'is_cancelled': string;
    'caregiver': Caregiver;
}

export interface Caregiver {
    'id': number;
    'registration_no': number;
    'chinese_name': string;
    'english_name': string;
    'nick_name': string;
    'hkid_card_no': string;
    'caregiver_type': string;
}

export interface Client {
    'id': number;
    'user_id': number;
    'first_name': string;
    'last_name': string;
    'home_telephone_number': string;
    'service_user_salute': string;
    'service_user_firstname': string;
    'service_user_lastname': string;
    'user': User;
}

export interface User {
    'id': number;
    'email': string;
    'mobile_number': string;
    'preferred_communication_language': string;
}