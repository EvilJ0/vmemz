//region imports
import * as passport from 'passport';


import {IMainController} from "../controllers/main.controller";

import * as PassportLocal from 'passport-local';
import {IUser} from '../../Shared/types/Entities/iUser';
const LocalStrategy = require('passport-local').Strategy;
//endregion

// export const local_Strategy =
//
//   new LocalStrategy(
//     async function (this: IMainController, username:string, password:any, done:any) {
//       console.log('strategy');
//       console.log(username);
//       console.log(password)
//       const user={
//         username: username,
//         password:password
//       }
//       // const
//       //  users: IUser[] = await this.main.mongoController.getUsers(),
//       //  user           = users.find(user => user.name === username);
// // console.log(users)
//       console.log('checking username: ' + username);
//
//       if (!user) {
//         console.log('ERROR: no user found');
//         return done('unauthorized access', false);
//       }
//
//
//
//       if (password==`123456`) {
//         console.log(`return user`)
//         return done(null,user);
//       }
//     }
//   );

export const local_Strategy =
   new LocalStrategy(
  async function (this: IMainController, userName:string, password:any, done:any) {
    console.log('strategy');
    const
      users: IUser[] = await this.main.userController.getUsers(),
      user           = users.find(user => user.name === userName);

    console.log('checking username: ' + userName);

    if (!user) {
      console.log('ERROR: no user found');
      return done('unauthorized access', false);
    }

    const validatePassword = (password:string) => this.authController.validatePassword(userName, password)

    if (validatePassword(password)
      .then((isValid) => {
        console.log('Response of validatePassword: ' + isValid);
        if (!isValid) {
          return done('unauthorized access: password problem', false);
        } else {
          // all is well, return successful user

          return done(null, user);
        }
      })) {
      console.log(`return user`)
      return done("unauthorized access", false);
    }
  }
);

passport.serializeUser(function (user, done) {

  if (user) done(null, user);
});

passport.deserializeUser(function (id, done) {

  done(null, id);

});
