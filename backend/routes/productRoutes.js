import express from 'express';
import ProductRepo from '../repos/product-repo.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  // Run a query to get all users
  const products = await ProductRepo.getProducts();

  // Send the result back to the person
  // who made this request
  res.send(products);
});

productRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const product = await ProductRepo.findById(id);

  if (product) {
    res.send(product);
  } else {
    res.sendStatus(404);
  }
});

export default productRouter;