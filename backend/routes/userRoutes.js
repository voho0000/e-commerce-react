import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../utils.js';
import UserRepo from '../repos/user-repo.js';


const userRouter = express.Router();

userRouter.post(
    '/signin', 
    expressAsyncHandler(async (req,res) => {
        var user = await UserRepo.findByEmail(req.body.email);
        user = user[0]
        
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)){
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
        res.status(401).send({message: 'Invalid email or password'})
    }))


export default userRouter;