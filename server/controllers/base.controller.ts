
import {IMainController} from './main.controller';

export interface IBaseController {
  main: IMainController

  init(): Promise<any>
}

export abstract class BaseController implements IBaseController{
  main!:IMainController;

  protected constructor() {
  }

  init(): Promise<any> {
    return Promise.reject(`Method not implemented`);
  }

}
