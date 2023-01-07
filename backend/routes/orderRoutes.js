import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import OrderRepo from '../repos/order-repo.js';
import UserRepo from '../repos/user-repo.js';
import ProductRepo from '../repos/product-repo.js';
import { isAuth, isAdmin } from '../utils.js';

const orderRouter = express.Router();


orderRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const orders = await OrderRepo.listOrder();
      res.send(orders);
    })
  );
  

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
    '/summary',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        console.log(req.user)
        const users = await UserRepo.countUserNum()
        const orders =  await OrderRepo.countOrderNum()
        const dailyOrders = await OrderRepo.countDailyOrderNum()
        const productCategories = await ProductRepo.countProductCategories()
        res.send({ users, orders, dailyOrders, productCategories });
    })
)

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

orderRouter.put(
    '/:id/deliver',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const orderId = req.params.id;
      await OrderRepo.updateOrderDelivery(orderId);
        res.send({ message: `Order ${orderId} Delivered` });
    })
  );

  orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const orderId = req.params.id;
      await OrderRepo.deleteOrder(orderId);
      res.send({ message: `Order ${orderId} Deleted` });
    })
  );



export default orderRouter;