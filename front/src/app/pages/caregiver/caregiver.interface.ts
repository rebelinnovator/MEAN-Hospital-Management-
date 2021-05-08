export interface ApiResponse {
    message: string;
    status: number;
    success: boolean;
    data: any;
}
export interface GetAccountUserInfo {
    message: string;
    status: number;
    success: boolean;
    data: AccountUser;
}

export interface AccountUser extends AccountUserData {
    'id': number;
    'first_name': string;
    'last_name': string;
    'slug': string;
    'home_telephone_number': string;
    'relation_with_service_user': string;
    'user_id': number;
    'caregiver_type': string;
    'english_name': string;
    'user': AccountUserData;
    'languages': any;
}

export interface AccountUserData {
    'id': number;
    'salute': string;
    'email': string;
    'preferred_communication_language': string;
    'mobile_number': string;
    'is_deleted': boolean;
    'dob': any
}

export interface PostAccountUserInfo {
    message: string;
    status: number;
    success: boolean;
    data: string;
}

export interface GetWorkInfo extends WorkInfoData {
    message: string;
    status: number;
    success: boolean;
    data: WorkInfoData;
}

export interface WorkInfoData {
    education: object;
    employer: object;
    id: number;
    licence_expiry_date: any;
    show_employer_option: string;
    previous_employer_details: any;
    current_employer_hospital_name: string;
    current_employer_work_type: string;
    current_employer_month: string;
    current_employer_year: string;
    current_employer_id: number;
}



export interface GetSkillSet extends SkillsData {
    message: string;
    status: number;
    success: boolean;
    data: SkillsData;
}

export interface SkillsData extends SkillSetData {
    id: number;
    self_introduction: string;
    skills: SkillSetData
}

export interface SkillSetData {
    id: number;
    type: string;
    english_title: string;
    en_explanation: string;
    ch_explanation: string;
    caregiver_type: string
}

export interface GetSkills extends SkillSetData {
    message: string;
    status: number;
    success: boolean;
    data: SkillSetData;
}

export interface GetAvailability {
    message: string;
    status: number;
    success: boolean;
    data: any;
}
export interface GetAvailabilityData extends AvailabilityObject, LocationObject {
    availability: AvailabilityObject;
    chinese_name: string;
    english_name: string;
    id: number;
    locations: LocationObject;
}
export interface LocationObject {
    id: number;
    name: string;
    parent_id: number;
    pivot: any;
}
export interface AvailabilityObject {
    id: number;
    caregiver_id: number;
    from_day: string;
    from_time: any;
    to_day: string;
    to_time: any;
    from_meridian: any;
    to_meridian: any;

}

export interface GetLocationList {
    message: string;
    status: number;
    success: boolean;
    data: any;
}
export interface GetCharges extends ChargesData {
    message: string;
    status: number;
    success: boolean;
    data: ChargesData;
}

export interface ChargesData {
    account_name: string;
    account_no: string;
    bank_code: string;
    bank_name: string;
    branch_code: string;
    charges: any;
    fps_mobile_number: string;
    id: number;
    payment_method_cheque: number;
    payment_method_online: number;
}

export interface ChargesObject {
    id: number;
    hour: number;
    caregiver_id: number;
    price: number;
}
export interface InputArray {
    id: any;
    hour: number;
    price: number;
}

export interface SendingDataTerms {
    registration_no: number;
    tnc_accepted_date: any;
    hkid_name: string;
}


export interface GetReferralBonus extends ReferralData {
    message: string;
    status: number;
    success: boolean;
    data: ReferralData;
}

export interface ReferralData {
    caregivers_reffered: number;
    due: number;
    earned: number;
    paid: number;
}

export interface GetProfileOverviewDetails extends OverViewData {
    message: string;
    status: number;
    success: boolean;
    data: OverViewData;
}
export interface OverViewData extends LanguageObject, UserObjectProfile, MetaData {
    caregiver_type: string;
    avg_rating: number;
    id: number;
    languages: LanguageObject;
    registration_no: number;
    self_introduction: string;
    user: UserObjectProfile;
    user_id: number;
    __meta__: MetaData
}
export interface LanguageObject {
    caregiver_id: number;
    id: number
    language: string;
    other_lang: string;
}
export interface UserObjectProfile {
    id: number;
    is_deleted: number;
    salute: number
}
export interface UserObject {
    id: number;
    salute: number
}
export interface MetaData {
    feedbacks_count: number;
}

export interface GetProfileInfoDetails extends InfoData {
    message: string;
    status: number;
    success: boolean;
    data: InfoData;
}

export interface InfoData extends EmployerObject, SkillsObject {
    chinese_name: string;
    english_name: string;
    caregiver_type: string;
    id: number;
    show_employer_option: string;
    employer: [EmployerObject];
    skills: [SkillsObject]
}
export interface EmployerObject {
    caregiver_id: number;
    from_month: any;
    from_year: any;
    id: number;
    is_current_employer: string;
    name: string;
    to_month: any;
    to_year: any
    work_type: string;
}
export interface SkillsObject {
    english_title: string
    id: number;
    type: string;
}

export interface GetProfileReviewDetails {
    message: string;
    status: number;
    success: boolean;
    data: any;
}

export interface GetSkillsHomePage {
    message: string;
    status: number;
    success: boolean;
    data: any;
}
export interface SearchCaregiver {
    message: string;
    status: number;
    success: boolean;
    data: {
        currentPage: number;
        data: [CaregiverList];
        next: number;
        pages: number;
        previous: number;
        recordPerPage: number;
        totalRecords: number;
    };
}
export interface CaregiverList extends ChargesObject, EducationObject, UserObject {
    avg_rating: number;
    charges: [ChargesObject];
    chinese_name: string;
    education: [EducationObject];
    employer: [EmployerObject];
    english_name: string;
    id: number;
    licence_expiry_date: string;
    nick_name: string;
    prev_exp: number;
    registration_no: number;
    show_employer_option: string;
    total_exp: number;
    user: UserObject
    user_id: number;
    currentEmployer: any;
    previousEmployer: any

}

export interface EducationObject {
    caregiver_id: number;
    degree: string;
    end_year: number;
    id: number;
    institute_name: string;
    start_year: number;
}

export interface LocationList extends SubLocationsList {
    id: number;
    name: string;
    subLocations: [SubLocationsList]
}

export interface SubLocationsList {
    id: number;
    name: string;
    parent_id: number;
}

export interface GetClientApointmentCount {
    message: string;
    status: number;
    success: boolean;
    data: {
        total_active_bookings: number;
    };
} 