import { IsNotEmpty } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    firstName: string;
    
    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    confirmPassword: string;

    role: string
    username: string
}