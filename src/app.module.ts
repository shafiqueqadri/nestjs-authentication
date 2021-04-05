import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { mailerConstants } from './constants';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join('public'),
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.mailtrap.io",
        port: 2525,
        secure: false,
        auth: {
          user: mailerConstants.user,
          pass: mailerConstants.password,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
    }),
    MulterModule.register({
      dest: './upload',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
