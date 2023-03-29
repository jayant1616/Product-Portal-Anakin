const express  = require('express');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else { 
    dotenv.config({ path: '.env.development' });
}

const bodyparser = require('body-parser');
const productController = require('./controllers/productController');
const authControler = require('./controllers/authController');
const checkAuthMiddleware = require('./middlewares/auth');
const {sequelize } = require('./models/models');
// const debug = require('debug')('myapp')
// process.env.DEBUG = 'myapp';

const app = express();
app.use(bodyparser.json());

app.get('/products/:brandId',productController.getProducts);
app.get('/:productId/stores',productController.getStores);
app.get('/promotions/:productId/:storeId/:discount',checkAuthMiddleware,productController.applyPromotion);
app.post('/register',authControler.registerControlller);
app.post('/login',authControler.loginController);
app.post('/products/create',productController.createNewProduct);
app.post('/retailers/create',productController.createRetailer);
app.post('/stores/create',productController.createStore);
app.post('products/list',productController.listProduct);

// let sequelize;
// const start =  ()=>{
//     try{
//         sequelize = new Sequelize('product_portal_db','root','admin',{
//             host : '127.0.0.1',
//             dialect : 'mysql',
//         });

//         app.listen(3000,()=>{
//             debug('server up and running @ port 3000');
//         });

//     }
//     catch(err){
//         console.log("error in connnecting to the database ",err);
//     }
// }

// start();
const start = async()=>{
try{
    // connectDb();
    await sequelize.authenticate();
    await sequelize.sync({forces:true,logging:false});
        // .then(()=>{
        //     console.log("Database synced");
        // })
        // .catch((err)=>{
        //     console.log("error in syncing db");
        //     throw err
        // })
    app.listen(3000,()=>{
        console.log('server up and running @ port 3000');
    });
}
catch(err){
    console.log("cant connect to db ", err);
}
}
start();

module.exports = app;