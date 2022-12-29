import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../utils.js';
import UserRepo from '../repos/user-repo.js';


const userRouter = express.Router();

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
        var user = await UserRepo.findByEmail(req.body.email);
        user = user[0]

        if (user) {
            console.log(generateToken(user));
            console.log(user);
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isadmin: user.isadmin,
                    token: generateToken(user),
                })
                return;
            }
        }
        res.status(401).send({ message: 'Invalid email or password' })
    })
)


userRouter.post(
    '/signup',
    expressAsyncHandler(async (req, res) => {
        var user = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            isadmin: req.body.isadmin ? req.body.isadmin : 0,
            token: ''
        };

        
        var createdUser = await UserRepo.createUser(user);
        createdUser = createdUser[0]
        user = {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            isadmin: createdUser.isadmin
        };
        createdUser.token = generateToken(user)
        createdUser = await UserRepo.updateUserToken(createdUser);
        createdUser = createdUser[0]

        res.send({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            isadmin: createdUser.isadmin,
            token: createdUser.token,
        });
    })
);


export default userRouter;