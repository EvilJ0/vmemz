import {IMainController}   from '../controllers/main.controller';
import {IUser}             from '../../Shared/types/Entities/iUser';
import {Request, Response} from 'express';
import * as bcrypt         from 'bcrypt';
import {IPost}             from "../../shared/types/Entities/iPost";

export const getUsersHandler = async function (this: IMainController, req: Request, res: Response) {
    try {
        const users             = await this.userController.getUsers();

        return res.json(users).end();

    } catch (e) {
        return res.status(404).send('error' + e);
    }
};

export const createUserHandler = async function (this: IMainController, req: Request, res: Response) {
    const This = this
    await bcrypt.hash(req.body.password, 10, function (err, hashed) {
        console.log(hashed);
        const newUserContent: IUser = {
            name       : req.body.name,
            likes      : [],
            posts      : [],
            postsLiked : [],
            likesGet   : [],
            dislikesGet: [],
            dislikes   : [],
            avatar     : req.body.avatar,
            password   : hashed
        };
        console.log(newUserContent);
        try {

            // console.log(This.userController.verifyUser(newUserContent.name));
            const newUser = This.userController.saveUser(newUserContent);
            // console.log(`save user work`);
            return res.json(newUser).end();

        } catch (e) {
            return res.status(404).json({msg: 'no user was added' + e});

        }
    });


};

export const getUserHandler = async function (this: IMainController, req: Request, res: Response) {
    try {
        const  user = await this.userController.getUser(req.params.id);

        return res.json(user).end();
    } catch (e) {
        return res.status(404).json({msg: 'no user not found' + e});
    }

};

export async function getUsersSocketHandler(this: IMainController) {
    try {
        const users             = await this.userController.getUsers();

        return users

    } catch (e) {
        return 'no Users';
    }

}
