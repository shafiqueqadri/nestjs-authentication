import { Body, Controller, Get, HttpStatus, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express'
import { UserService } from '../user/user.service';
import { SignupDto, SigninDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import * as bcrypt from "bcrypt";
import { jwtConstants } from 'src/constants';
import { AuthGuard } from '@nestjs/passport';
import { env } from 'process';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() signinDto: SigninDto, @Req() req: Request, @Res() res: Response) {
        try {
            const response = await this.authService.login(req.user);
            return res.json({ status: "success", message: "Successfully LoggedIn", data: response })
        } catch (error) {
            console.log(error.message);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: "error", message: "Something went wrong!." })
        }
    }

    @Post("signup")
    async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
        try {
            const checkUserWithEmail = await this.userService.findByEmail(signupDto.email);

            if (checkUserWithEmail && checkUserWithEmail.email) {
                return res
                    .status(409)
                    .json({ status: 'error', message: "EMAIL Already Registered" });
            }

            if (signupDto.password !== signupDto.confirmPassword) {
                return res
                    .status(422)
                    .json({ status: 'error', message: "Validation Error!", errors: { confirmPassword: 'Password and Confirm Password Doesn\'t match.'} });
            }

            const createUser = await this.userService.create({
                ...signupDto,
                roles: ['user'],
                emailVerified: false,
                password: bcrypt.hashSync(signupDto.password, jwtConstants.salt)
            });

            await this.userService.sendEmail(
                signupDto.email,
                `Your account has been registered successfully. Please <a href="${env.BASE_URL}/api/v1/auth/verify/email/${String(createUser._id)}">Click here</a> to verify email.`
            );
            return res.status(201).json({ status: "success", message: "Please check your inbox to verify email." });
        } catch (error) {
            this.logger.error(error);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: "error", message: "Something went wrong!." })
        }

    }

    @Get('/verify/email/:code')
    async verifyEmail(@Param() params: {code: string}, @Res() res: Response) {
        const verify = await this.userService.findByIdAndUpdate(params.code, { emailVerified: true })
        
        res.redirect(`${env.FRONTEND_BASE_URL}/login?verified=true`);
    }

    @Post('forget-password')
    async forgetPassword(@Body() body: any, @Res() res: Response) {
        try {
            const checkUserWithEmail = await this.userService.findByEmail(body.email);
            if (!checkUserWithEmail) {
                return res.status(400).json({ status: "error", message: "User Not Found!" })
            }
            const verificationProcess = await this.authService.forgetPassword(
                body.email
            );
            res.status(201).json(verificationProcess);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: "error", message: "Something went wrong!." })
        }
    }

    @Post("verify-code")
    async verifyCode(@Body() body: any, @Res() res: Response) {
        const { email, code } = body;
        const verifiedUpdate = await this.authService.checkCode(email, code);
        res.status(HttpStatus.OK).json(verifiedUpdate);
    }

    @Post("reset-password")
    async resetPassword(@Body() body: any, @Res() res: Response) {
        const { email, password: newPassword } = body;
        const updatePassword = await this.authService.updatePassword(email, newPassword);
        res.json(updatePassword);
    }

    @Get("/google")
    @UseGuards(AuthGuard("google"))
    async googleAuth(@Req() req) { }

    @Get("google/redirect")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        
        const { user } = req;
        
        let checkUser = await this.userService.findByEmail(user.email);
        if (!checkUser) {
            const data = {
                email: user.email,
                avatar: user.picture || '',
                displayName: `${user.firstName + " " + user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                password: bcrypt.hashSync(`${new Date().getTime()}-ALS`, jwtConstants.salt),
                emailVerified: true
            };
            checkUser = await this.userService.create(data);
        }
        const loggedInUser = await this.authService.login(checkUser)
        res.redirect(`${env.FRONTEND_BASE_URL}/login?token=${loggedInUser.access_token}`);
    }

    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req, @Res() res: Response): Promise<any> {

        const { user: { user } } = req;
        
        
        let checkUser = await this.userService.findByEmail(user.email);
        if (!checkUser) {
            const data = {
                email: user.email,
                avatar: user.picture || '',
                displayName: `${user.firstName + " " + user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                password: bcrypt.hashSync(`${new Date().getTime()}-ALS`, jwtConstants.salt),
                emailVerified: true
            };
            console.log(data);
            checkUser = await this.userService.create(data);
        }
        const loggedInUser = await this.authService.login(checkUser)
        res.redirect(`${env.FRONTEND_BASE_URL}/login?token=${loggedInUser.access_token}`);
    }
}
