export interface LoginUserBody {
    email: string,
    password: string
}

export interface RegisterUserBody {
    name: string,
    email: string,
    password: string,
    gender: string,
    about: string,
    profile_image: File | null
}

export interface OTPVerifyPayLoad {
    email: string,
    OTP: string
}

export interface ChangePasswordPayload {
    email: string,
    newPassword: string
}