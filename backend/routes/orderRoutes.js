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
        const order = await OrderRepo.createOrder(userID, orderInfo);
        res.status(201).send({ message: 'New Order Created', order });
    })
);

orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
    const orders = await OrderRepo.findByUser(req.user.id);
    res.send(orders);
    })
  );
  

orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await OrderRepo.findById(req.params.id);
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    })
);

orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = req.body
        const rows = await OrderRepo.updateOrderPay(order)
        res.send(rows)
    })
  );
  

export default orderRouter;
