export interface ApiResponse {
    message: string;
    status: number;
    success: boolean;
}

// Reset Password & ConfirmEmail
export interface ResetPassword {
    message: string;
    status: number;
    success: boolean;
    data: UserType;
}

export interface UserType {
    'user_type': string;
}

// Client Login
export interface ClientLogin extends LoginData {
    message: string;
    status: number;
    success: boolean;
    data: LoginData;
}

export interface LoginData extends AccessToken {
    'accessToken': AccessToken;
    'user_id': number;
    'email': string;
    'slug': string;
    'current_step': string;
    'first_name': string;
    'last_name': string;
}

export interface AccessToken {
    'type': string;
    'token': string;
    'refreshToken': string;
}

// Caregiver Login
export interface CaregiverLogin extends CaregiverLoginData {
    message: string;
    status: number;
    success: boolean;
    data: CaregiverLoginData;
}

export interface CaregiverLoginData extends AccessToken {
    'accessToken': AccessToken;
    'user_id': number;
    'email': string;
    'registration_no': number;
    'caregiver_type': string;
    'current_step': string;
    'english_name': string;
    'chinese_name': string;
}