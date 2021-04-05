import { IsNotEmpty } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    displayName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    postalCode: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string

    interests: any;
    country: any;
    city: string;

    preferences: any
}

export class SigninDto {
    
    @IsNotEmpty()
    identifier: string;

    @IsNotEmpty()
    password: string;
}