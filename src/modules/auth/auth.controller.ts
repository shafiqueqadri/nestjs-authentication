import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express'
import { UserService } from '../user/user.service';
import { SignupDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import * as bcrypt from "bcrypt";
import { jwtConstants } from 'src/constants';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService, 
        private readonly userService: UserService
    ){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response) {
        try{
            const response = await this.authService.login(req.user);
            return res.json({status: "success", message: "Successfully LoggedIn", data: response})
         }catch(error){
             console.log(error.message);
             return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: "error", message: "Something went wrong!."})
         }
    }

    @Post("signup")
    async signup(@Body() signupDto: SignupDto,@Res() res: Response){
        try{
            const checkUserWithEmail = await this.userService.findByEmail(signupDto.email);
      
            if (checkUserWithEmail && checkUserWithEmail.email) {
                return res
                .status(409)
                .json({ status: 'error', message: "EMAIL Already Registered" });
            }

            const checkUserWithUsername = await this.userService.findByUsername(signupDto.username);
      
            if (checkUserWithUsername && checkUserWithUsername.username) {
                return res
                .status(409)
                .json({ status: 'error', message: "Username Already Registered" });
            }
      
          const createUser = await this.userService.create({
            ...signupDto,
            roles: [signupDto.role],
            password: bcrypt.hashSync(signupDto.password, jwtConstants.salt)
          });
          const user = await this.authService.login(createUser);
          await this.userService.sendEmail(
            signupDto.email,
            "Your account has been registered successfully"
          );
        return res.status(201).json({status: "success", message: "Successfully Signup", data: user});
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: "error", message: "Something went wrong!."})
        }
        
    }

    @Post('forget-password')
    async forgetPassword(@Body() body: any, @Res() res: Response){
        try{
            const checkUserWithEmail = await this.userService.findByEmail(body.email);
            if (!checkUserWithEmail) {
              return res.status(400).json({ status: "error", msg: "User Not Found!" })
            }
            const verificationProcess = await this.authService.forgetPassword(
              body.email
            );
            res.status(201).json(verificationProcess);
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({status: "error", message: "Something went wrong!."})
        }  
    }

    @Post("verify-pin")
    async verifyPinCode(@Body() body: any, @Res() res: Response) {
        const { email, pin } = body;
        const verifiedUpdate = await this.authService.checkPin(email, pin);
        res.json(verifiedUpdate);
      }
      @Post("reset-password")
      async resetPassword(@Body() body: any, @Res() res: Response) {
        const { email, newPassword } = body;
        const updatePassword = await this.authService.updatePassword(email, newPassword);
        res.json(updatePassword);
      }
}
