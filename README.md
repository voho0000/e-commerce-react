# E-commerce

## Reference
The original version is the following repository:  
https://github.com/basir/mern-amazona

Our modification: 
1. MongoDB change to SQL database  

Future modification:  
1. Add coupon functionality

## Steps
1. Create React App + Create Git Repository
2. List Products
    1. Create product array 
    2. add produc image
    3. render products
    4. style products
3. Add page routing
   1. npm install react-router-dom (frontend)
   2. create route for home screen
   3. create router for product screen
4. Create Node.JS Server
   1. run npm init in root folder
   2. Update package.json set type: module
   3. Add .js to imports
   4. npm install express (backend)
   5. create server.js
   6. add start command as node backend/server.js
   7. require express
   8. create route for / return backend is ready.
   9. move products.js from frontend to backend
   10. create route for /api/products
   11. return products
   12. run npm start
5. Fetch Products From Backend
   1. set proxy in package.json
   2. npm install axios (frontend+backend)
   3. use state hook
   4. use effect hook
   5. use reducer hook
6. Manage State By Reducer Hook
   1. define reducer
   2. update fetch data
   3. get state from usReducer
7. Add bootstrap UI Framework
    1. npm install react-bootstrap bootstrap (frontend)
    2. update App.js
8. Create Product and Rating Component
    1. create Rating component
    2. Create Product component
    3. Use Rating component in Product component
9. Create Product Details Screen
    1. npm install react-helmet-async (frontend)
    2. fetch product from backend
    3. create 3 columns for image, info and action
10. Create Loading and Message Component
    1. create loading component
    2. use spinner component
    3. craete message component
    4. create utils.js to define getError fuction
11. Create React Context For Add Item To Cart
    1. Create React Context
    2. define reducer
    3. create store provider
    4. implement add to cart button click handler
12. Complete Add To Cart
    1. check exist item in the cart
    2. check count in stock in backend
13. Create Cart Screen
    1. create 2 columns
    2. display items list
    3. create action column
14. Complete Cart Screen
    1. click handler for inc/dec item
    2. click handler for remove item
    3. click handler for checkout
15. Create Signin Screen + Connect to PostgreSQL database 
    - Create Signin Screen
    1. create sign in form
    2. add email and password
    3. add signin button
    - Connect to PostgreSQL database
    1. npm install express (backend)
    2. config postgresql server
    3. pool connection
    4. productRouter 
    5. find products SQL query
    6. change data name to match database column name
    7. test request from extension: rest-cilent
16. Seed a user + Signin Backend API
    1. npm install bcryptjs (backend)
    2. npm install jsonwebtoken (backend)
    3. npm install --save express-async-handler (backend)
    3. create signin api
    4. define generateToken
    6. seed a user for testing insert value into SQL database
17. Complete Signin Screen
    1. handle submit action
    2. save token in store and local storage
    3. show user name in header
18. Create Shipping Screen
    1. create form inputs
    2. handle save shipping address
    3. add checkout wizard bar
19. Create Sign Up Screen
    1. create input forms
    2. handle submit
    3. create backend api
20. Implement Select Payment Method Screen
    1. create input forms
    2. handle submit
21. Create Place Order Screen
    1. show cart items, payment and address
    2. calculate order summary
22. Implement Place Order Action
    1. handle place order action
    2. create order create api
    3. modify name to match database schema
    4. **Problem: infinite looping while add order in useEffect dependency array(Unsolved)**
        - temporary solution: remove order from useEffect dependency array.
23. Pay Order By a button
    1. create pay order api in backend
    2. create pay button and handler
24. Display Order History
    1. create order screen
    2. create order history api
    3. use api in the frontend
25. Create Profile Screen
    1. get user info from context
    2. show user information
    3. create user update api
    4. update user info
26. Add Sidebar and Search Box
    1. add sidebar
    2. add search box
27. Create Search Screen
    1. show filters
    2. create api for searching products
    3. display results
    4. unsolve: filter problem 
        - same created_time of products
        - condition disappear
28. Create Admin Menu
    1. define protected route component
    2. define admin route component
    3. add menu for admin in header