const express  = require('express');
const bodyparser = require('body-parser');
const Db = require('./models/models');
const productController = require('./controllers/productController');
const authControler = require('./controllers/authController');
const checkAuthMiddleware = require('./middlewares/auth');

const app = express();
app.use(bodyparser.json());

app.get('/products/:brandId',productController.getProducts);
app.get('/:productId/stores',productController.getStores);
app.get('/promotions/:productId/:storeId/:discount',checkAuthMiddleware,productController.applyPromotion);
app.post('/register',authControler.registerControlller);
app.post('/login',authControler.loginController);

app.listen(3000,()=>{
    console.log("server up and running @ port 3000");
})