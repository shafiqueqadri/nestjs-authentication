import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
import { FORGET_PASSWORD_REPOSITORY, jwtConstants } from 'src/constants';
import { Model } from 'mongoose';
import { IForgetPasswordDocument } from '../user/user.schema';
import { env } from 'process';
import { v4 } from 'uuid'

@Injectable()
export class AuthService {
    constructor(
      @Inject(FORGET_PASSWORD_REPOSITORY) private readonly passwordRepository: Model<IForgetPasswordDocument>,
      private readonly userService: UserService,
      private jwtService: JwtService
    ){}

    async validateUser(identifier: string, password: string): Promise<any> {
        const user = await this.userService.findOneByEmailOrUsername(identifier);
        if (user && bcrypt.compareSync(password, user.password)) {
          return user.toJSON();
        }
        return null;
    }


    async login(user: any) {
        const payload = { email: user.email, sub: user._id };
        return {
          access_token: this.jwtService.sign(payload),
          user 
        };
    }

    async forgetPassword(email: any) {
      const code = v4()
  
      const check = await this.passwordRepository.findOne({ email: email });
      if (check) {
       await this.passwordRepository.updateOne(
          { email: email },
          { code, createdAt: new Date()}
        );
      } else {
        await this.passwordRepository.create({
          email: email,
          code
        });
      }
      this.userService.sendEmail(
        email,
        `Here is your link to reset password <a href="${env.FRONTEND_BASE_URL}/reset-password/${email}/${code}">Click here</a>.`
      );
      return { status: "success", message: "Email with reset link is sent to user email" };
    }

    async checkCode(email, code) {
      const verify = await this.passwordRepository.findOne({ email: email, code, createdAt:{$gt: new Date(Date.now() - 4*60*60 * 1000)}});
      if (verify) {
        return { status: "success", message: "Link is Verified" };
      } else {
        return { status: "error", message: "Link Expired" };
      }
    }
    async updatePassword(email, password) {
      const pass = bcrypt.hashSync(password, jwtConstants.salt);
      await this.userService.updatePassword({email, password: pass})
      return {
        status: "success",
        message: "password updated"
      };
    }
}