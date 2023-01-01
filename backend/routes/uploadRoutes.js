import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import ProductRepo from '../repos/product-repo.js';
import { isAdmin, isAuth } from '../utils.js';

const uploadRouter = express.Router();

uploadRouter.post(
    '/:id',
    isAuth,
    isAdmin,
    async (req, res) => {
        const productId = req.params.id;
        const file = req.files.file
        const image_url = `/images/${file.name}`
        await ProductRepo.updateImage(image_url, productId)
        // image in backend/images folder
        file.mv(`./images/${file.name}`, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            } else {
                res.send({ image_url });
            }
        });
    }
);
export default uploadRouter;