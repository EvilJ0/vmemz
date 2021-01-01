import {BaseController, IBaseController} from './base.controller';
import {IUser} from '../../Shared/types/Entities/iUser';


export interface IUserController extends IBaseController {
  getUsers(): Promise<IUser[]>;

  saveUser(user: IUser): Promise<any>;

  getUser(user_id: string):Promise<IUser>

  verifyUser(userName: string): boolean;

  getUserByName(userName: string): Promise<any>;
}

export class UserController extends BaseController implements IUserController {
  constructor() {
    super();
  }

  async getUsers(): Promise<IUser[]> {
    return this.main.mongoController.getUsers();
  }

  async saveUser(user: IUser): Promise<any> {
    console.log('Meow')
    return this.main.mongoController.saveUser(user);
  }

  async  getUser(user_id: string): Promise<IUser>{
    return this.main.mongoController.getUser(user_id);
  }

  async getUserByName(userName: string): Promise<any> {
    return this.main.mongoController.getUserByName(userName);
  }

  verifyUser(userName: string): boolean {
    return this.main.mongoController.verifyUser(userName);
  }


}
