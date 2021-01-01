import {BaseController, IBaseController} from './base.controller';
import * as express from 'express';
import {Request, Response} from 'express';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
import * as bcrypt from 'bcrypt';
import {IUser} from '../../Shared/types/Entities/iUser';
import {IMainController} from './main.controller';

const router = express.Router();
const saltRounds = 10;


export interface IAuthController extends IBaseController {

  validatePassword(userName: string, password: string): Promise<boolean>



  auth(): (req: Request, res: Response, next: any) => void;


  isLoggedIn(req, res, next): Response<any> | void;
}

export class AuthController extends BaseController implements IAuthController {

  constructor() {
    super();
  }

  async validatePassword(userName: string, password: string) {
    const dbPasswordHash = await this.main.userController.getUserByName(userName);
    return bcrypt.compare(password, dbPasswordHash.password);
  }



  auth() {
    return async (req: Request, res: Response, next: any) => {

      const
        users: IUser[] = await this.main.mongoController.getUsers(),
        user           = users.find(user => user.name === req.body.username);
      console.log(user)
      passport.authenticate('local', (error, user, info) => {

        if (error) {
          res.status(400).json({'statusCode': 400, 'message': error});
        }
        req.login(user, function(error) {

          if (error) {
            return next(error);
          }
          next();
        });
      })(req, res, next);
    }
  }

  isLoggedIn(req, res, next) {
    console.log('session ', req.session);
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(400).json({'statusCode': 400, 'message': 'not authenticated'});
  }
}


