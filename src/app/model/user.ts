export class Balance {
    id!: number;
    value!: number;
    unit!: string;
}

export class Profil {
    id!: number;
    code!: string;
    name!: string;
}

export class Entite {
    id!: number;
    name!: string;
    code_marchand!: string;
    msisdn!: string;
    
}

export class LoginRequest {
    email!: string;
    password!: string;
}

export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    msisdn!: string;
    code!: string;
    password!: string;
    profil!: number;
    entite!: number;
    status!: boolean
    balance!: Balance;
}

export class UserMe {
    username: string | undefined;
    password: string | undefined;
    status: string | undefined;
    email: string | undefined;
    role: string | undefined;
    token?: string;
    refreshToken?: string;
}