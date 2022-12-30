import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import ProductRepo from '../repos/product-repo.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  // Run a query to get all users
  const products = await ProductRepo.getProducts();

  // Send the result back to the person
  // who made this request
  res.send(products);
});

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    // get all catogories
    const categories = await ProductRepo.getCategories();
    res.send(categories);
  })
);

productRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const product = await ProductRepo.findById(id);

  if (product) {
    res.send(product);
  } else {
    res.sendStatus(404);
  }
});

export default productRouter;