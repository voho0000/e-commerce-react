import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import CartRepo from '../repos/cart-repo.js';

const cartRouter = express.Router();


cartRouter.get(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const cartItems = await CartRepo.findByUser(req.user.id);
        res.send({ cartItems });
    })
);

cartRouter.delete(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        await CartRepo.deleteByUser(req.user.id);
        res.send({ message: `Cart Items Deleted` });
    })
);

cartRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const cartItems = req.body.cartItems;
        const userId = req.user.id
        await CartRepo.deleteByUser(req.user.id);
        cartItems.map(async (cartItem)=>(await CartRepo.updateByUser(userId, cartItem)))
        res.send({ cartItem });
    })
);


export default cartRouter;