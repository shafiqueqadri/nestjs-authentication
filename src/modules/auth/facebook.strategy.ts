// import { Injectable } from "@nestjs/common";
// import * as FacebookTokenStrategy from "passport-facebook-token";
// import { use } from "passport";

// @Injectable()
// export class FacebookStrategy {
//   constructor() {
//     this.init();
//   }
//   init() {
//     console.log("##################### initialized");
//     use(
//       new FacebookTokenStrategy(
//         {
//           clientID: "275856216857502",
//           clientSecret: "4dab6a604d9567a740021760daddbf54"
//         },
//         async (
//           accessToken: string,
//           refreshToken: string,
//           profile: any,
//           done: any
//         ) => {
//           const user = {};
//           return done(null, user);
//         }
//       )
//     );
//   }
// }
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { env } from "process";
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: `${env.BASE_URL}/api/v1/auth/facebook/redirect`,
      scope: "email",
      profileFields: ["emails", "name"]
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName
    };
    const payload = {
      user,
      accessToken
    };

    done(null, payload);
  }
}
