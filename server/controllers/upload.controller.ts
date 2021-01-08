import {BaseController, IBaseController} from './base.controller';


export interface IUploadController extends IBaseController {

    getFile(filename: string): Promise<any>

    getLastUpload(): Promise<any>

}


export class UploadController extends BaseController implements IUploadController {

    constructor() {
        super();
    }

    async getFile(filename): Promise<any> {
        return
        await this.main.mongoController.getFile(filename);

    }

    async getLastUpload(): Promise<any> {
        return
        // await this.main.mongoDbController.getLastUpload();

    }
}
