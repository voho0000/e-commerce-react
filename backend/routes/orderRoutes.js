import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import OrderRepo from '../repos/order-repo.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();
orderRouter.post(
    '/',
    // get user id from token
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const userID = req.user.id
        const orderInfo = req.body
        //console.log(orderInfo)
        const order = await OrderRepo.createOrder(userID, orderInfo);
        console.log(order)
        res.status(201).send({message: 'New Order Created', order});
    })
);

export default orderRouter;
