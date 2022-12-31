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
  '/testquery',
  expressAsyncHandler(async (req, res) => {
    const testquery = await ProductRepo.testQuery();
    const test= `aaa`+`bbb`
    //console.log(testquery)
    res.send({"test":test})
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
    console.log(products)
    console.log(countProducts)
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

  if (product) {
    res.send(product);
  } else {
    res.sendStatus(404);
  }
});



/*



    // 一個傳符合的商品
    // 一個傳符合的商品數
    // 一個傳現在第幾頁 （沒傳就當第一頁）
    // 一個傳一頁page包含最多幾樣商品

*/

export default productRouter;