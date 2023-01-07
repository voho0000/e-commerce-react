import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';
import CouponRepo from '../repos/coupon-repo.js';

const PAGE_SIZE = 3;

const couponRouter = express.Router();

couponRouter.get(
    '/discount',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const coupons = await CouponRepo.findDiscountAll()
        res.send(
            coupons
        );
    })
);

couponRouter.post(
    '/discount/create',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const coupon = {
            name: req.body.name,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            price_criteria: req.body.price_criteria,
            discount_num: req.body.discount_num,
            max_num: req.body.max_num,
            code: req.body.discount_code
        };
        await CouponRepo.createDiscountCoupon(coupon)
        res.status(201).send({
            message: 'Discount Coupon Created',
        });

    })
);


couponRouter.delete(
    '/discount/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const couponId = req.params.id;
      await CouponRepo.deleteDiscountCoupon(couponId);
      res.send({ message: `Coupon ${couponId} Deleted` });
    })
  );

  couponRouter.get(
    '/discount/:code',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const code = req.params.code
        const coupon = await CouponRepo.findDiscountCode(code);
        if (coupon) {
            res.send(coupon);
        } else {
            res.send('');
        }
    })
);

couponRouter.get(
    '/shipping',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const coupons = await CouponRepo.findShippingAll()
        res.send(
            coupons
        );
    })
);

couponRouter.post(
    '/shipping/create',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const coupon = {
            name: req.body.coupon_name,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            price_criteria: req.body.price_criteria,
            max_num: req.body.max_num,
            code: req.body.shipping_code
        };
        await CouponRepo.createShippingCoupon(coupon)
        res.status(201).send({
            message: 'Shipping Coupon Created',
        });

    })
);


couponRouter.delete(
    '/shipping/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const couponId = req.params.id;
      await CouponRepo.deleteShippingCoupon(couponId);
      res.send({ message: `Shipping Coupon ${couponId} Deleted` });
    })
  );

couponRouter.get(
    '/shipping/:code',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const code = req.params.code
        const coupon = await CouponRepo.findShippingCode(code);
        if (coupon) {
            res.send(coupon);
        } else {
            res.send('');
        }
    })
);


export default couponRouter;