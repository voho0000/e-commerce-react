import express from 'express';
import data from '../data.js';
import CreateUserRepo from '../repos/create-user-repo.js'
import bcrypt from 'bcryptjs';

const seedRouter = express.Router();

// Create a user to test post and get data for signin
const user = {
    id: 4,
    name: "Ariel",
    email: "ariel@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: 1,
    token:123
};


seedRouter.get('/', async (req, res) => {
    console.log(user.name)
    const createdProducts = await CreateUserRepo.createUser(user);
    res.send({ createdProducts });
  });
  export default seedRouter;