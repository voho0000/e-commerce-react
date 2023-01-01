import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import ProductRepo from '../repos/product-repo.js';
import { isAuth, isAdmin } from '../utils.js';
import fs from 'fs';

const productRouter = express.Router();
const PAGE_SIZE = 3;

productRouter.get('/', async (req, res) => {
  // Run a query to get all users
  const products = await ProductRepo.getProducts();

  // Send the result back to the person
  // who made this request
  res.send(products);
});

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = {
      name: 'sample name ' + Date.now(),
      image_url: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countinstock: 0,
      rating: 0,
      num_reviews: 0,
      description: 'sample description',
    };
    const product = await ProductRepo.createProduct(newProduct);
    console.log(product);
    //res.send({ message: 'Product Created', product });
  })
);


productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page ? query.page : 1;
    const pageSize = query.pageSize ? query.pageSize : PAGE_SIZE;
    const products = await ProductRepo.findByPage(query)
    const countProducts = await ProductRepo.countProductAll();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);


productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const PAGE_SIZE = 3
    const pageSize = query.pageSize ? query.pageSize : PAGE_SIZE;
    const page = query.page ? Number(query.page) : 1;
    const products = await ProductRepo.filterProduct(query);
    const countProducts = await ProductRepo.countProduct(query);
    console.log(pageSize)
    console.log(page)
    console.log(countProducts )
    console.log(products)
    res.send({      
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),});
  })
  );


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
  res.send(product);

});

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await ProductRepo.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image_url = req.body.image_url;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countinstock = req.body.countinstock;
      product.description = req.body.description;
      await ProductRepo.updateProduct(product)
      // move image from backend/images/ to frontend/public/images/
      fs.rename('.'+product.image_url, '../frontend/public/images/'+product.image_url.substring(8), function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });
      res.send({ message: 'Product Updated' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    await ProductRepo.deleteProduct(productId);
    res.send({ message: `Product ${productId} Deleted` });
  })
);

/*



    // 一個傳符合的商品
    // 一個傳符合的商品數
    // 一個傳現在第幾頁 （沒傳就當第一頁）
    // 一個傳一頁page包含最多幾樣商品

*/

export default productRouter;