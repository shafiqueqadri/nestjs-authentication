import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({usernameField: 'identifier'});
  }

  async validate(identifier: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(identifier, password);
    console.log(user);
    
    if (!user) {
      throw new NotFoundException('Email or Password is incorrect!');
    }
    if (!user?.emailVerified) {
      throw new NotFoundException('Email is not verified, please check your inbox or reset your password!');
    }
    return user;
  }
}
