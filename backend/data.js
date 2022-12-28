import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
    products: [
      {
        id:1,
        name: 'iPhone 13 Pro',
        slug: 'iphone-13-pro',
        category: 'Phone',
        image: '/images/iphone-13-pro.jpg', // 679px × 829px
        price: 120,
        countInStock: 0,
        brand: 'Apple',
        rating: 4.5,
        numReviews: 10,
        description: 'high quality phone',
      },
      {
        id:2,
        name: 'Google Pixel 7 Pro',
        slug: 'google-pixel-7-pro',
        category: 'Phone',
        image: '/images/google-pixel-7-pro.jpg',
        price: 250,
        countInStock: 20,
        brand: 'Google',
        rating: 4.0,
        numReviews: 10,
        description: 'high quality product',
      },
      {
        id:3,
        name: 'Acer Aspire 5 A515-56-32DK',
        slug: 'acer-aspire-5-a515-56-32dk',
        category: 'Laptop',
        image: '/images/acer-aspire-5-a515-56-32dk.jpg',
        price: 25,
        countInStock: 15,
        brand: 'Acer',
        rating: 4.5,
        numReviews: 14,
        description: 'high quality product',
      },
      {
        id:4,
        name: '2020 Apple MacBook Air M1',
        slug: '2020-apple-macbook-air-m1',
        category: 'Laptop',
        image: '/images/2020-apple-macbook-air-m1.jpg',
        price: 65,
        countInStock: 5,
        brand: 'Apple',
        rating: 4.5,
        numReviews: 10,
        description: 'high quality product',
      },
    ],
  };
  export default data;