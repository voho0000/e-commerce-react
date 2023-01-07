import express from 'express';
import data from './data.js'; 
import * as pg from 'pg'
import * as dotenv from 'dotenv' 
import productRouter from './routes/productRoutes.js';
import pool from './pool.js'
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import couponRouter from './routes/couponRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import fileUpload from 'express-fileupload';


/*
pool.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
*/

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ uploadDir: './images/' }));

app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/cart', cartRouter);


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

/*
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

app.get('/api/products/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const product = data.products.find((x) => x.id === itemId);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
*/

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
