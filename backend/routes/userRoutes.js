import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin, generateToken } from '../utils.js';
import UserRepo from '../repos/user-repo.js';
import CartRepo from '../repos/cart-repo.js';


const userRouter = express.Router();

userRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const users = await UserRepo.findAll()
      res.send(users);
    })
  );

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
        var user = await UserRepo.findByEmail(req.body.email);
        user = user[0]
        const cartItems = await CartRepo.findByUser(user.id);
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                res.send({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isadmin: user.isadmin,
                    token: generateToken(user),
                    cartItems
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
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            isadmin: req.body.isadmin ? req.body.isadmin : 0
        };


        const createdUser = await UserRepo.createUser(user);

        res.send({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            isadmin: createdUser.isadmin,
            token: generateToken(createdUser),
        });
    })
);

userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await UserRepo.findById(req.user.id);
        if (user) {
            user.name = req.body.name ? req.body.name : user.name;
            user.email = req.body.email ? req.body.email : user.email;
            if (req.body.password) {
                user.password = bcrypt.hashSync(req.body.password, 8);
            }
            const updatedUser = await UserRepo.updateUserProfileInfo(user);
            res.send({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                isadmin: updatedUser.isadmin,
                token: generateToken(updatedUser)
            });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    })
);

userRouter.get(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await UserRepo.findById(req.params.id);
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );
  
  userRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const user = await UserRepo.findById(req.params.id);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isadmin = Number(req.body.isadmin);
        const updatedUser = await UserRepo.updateUserAuth(user);
        res.send({ message: 'User Updated', user: updatedUser });
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
    })
  );

export default userRouter;