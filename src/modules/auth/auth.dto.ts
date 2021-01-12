import { IsNotEmpty } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    age: number;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    role: string;
}