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
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
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
            isAdmin: req.body.isAdmin ? req.body.isAdmin : 0,
            token: ''
        };

        user.token = generateToken(user)
        var createdUser = await UserRepo.createUser(user);
        createdUser = createdUser[0]

        res.send({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin,
            token: createdUser.token,
        });
    })
);


export default userRouter;