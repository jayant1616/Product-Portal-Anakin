const Sequelize = require('sequelize');
// const sequelize = require('../index');
// const dotenv = require('dotenv').config();

// if (process.env.NODE_ENV === 'production') {
//   dotenv.config({ path: '.env.production' });
// } else { 

//     dotenv.config({ path: '.env.development' });
// }
// console.log(process.env);


// const sequelize = new Sequelize('product_portal_db',`${process.env.DB_USER}` ,`${process.env.DB_PASSWORD}`,{
//     host : `${process.env.DB_HOST}`,
//     dialect : 'mysql',
// });

let sequelize, Brand, Retailer, Product, Store, Promotion, User, Alert;

sequelize = new Sequelize('product_portal_db','root','admin',{
    host : '127.0.0.1',
    dialect : 'mysql',
});
console.log("repeat" ,process.env.DB_HOST);
Brand = sequelize.define('Brand',{
    name : Sequelize.STRING,
});

Retailer = sequelize.define('Retailer',{
    name : Sequelize.STRING,
});

Product = sequelize.define('Product',{
    name : Sequelize.STRING,
});

Store = sequelize.define('Store',{
    name : Sequelize.STRING,
});

Promotion = sequelize.define('Promotion',{
    discount : Sequelize.FLOAT,
    startDate : Sequelize.DATE,
    endDate : Sequelize.DATE,
});

User = sequelize.define('User',{
    username : Sequelize.STRING,
    password : Sequelize.STRING,
});

Alert = sequelize.define('Alert',{
    priceDecrease : Sequelize.INTEGER,
    time : Sequelize.TIME
})

Brand.hasMany(Product);
Product.belongsTo(Brand);

Retailer.hasMany(Store);
Store.belongsTo(Retailer);

Product.belongsToMany(Store,{through:Promotion});
Store.belongsToMany(Product,{through:Promotion});

User.hasOne(Brand);
Brand.hasOne(User);

Product.hasMany(Alert);
Alert.belongsTo(Product);

module.exports = {
    "Brand" : Brand,
    "Retailer": Retailer,
    "Product" : Product,
    "Store" : Store,
    "Promotion": Promotion,
    "User" : User,
    'sequelize' : sequelize,
    "Alert" : Alert,
}
