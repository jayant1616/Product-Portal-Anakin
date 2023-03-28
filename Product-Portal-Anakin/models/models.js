const Sequelize = require('sequelize');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const sequelize = new Sequelize('product_portal_db',`${process.env.DB_USER}` ,`${process.env.DB_PASSWORD}`,{
    host : `${process.env.DB_HOST}`,
    dialect : 'mysql',
});

const Brand = sequelize.define('Brand',{
    name : Sequelize.STRING,
});

const Retailer = sequelize.define('Retailer',{
    name : Sequelize.STRING,
});

const Product = sequelize.define('Product',{
    name : Sequelize.STRING,
});

const Store = sequelize.define('Store',{
    name : Sequelize.STRING,
});

const Promotion = sequelize.define('Promotion',{
    discount : Sequelize.FLOAT,
    startDate : Sequelize.DATE,
    endDate : Sequelize.DATE,
});

const User = sequelize.define('User',{
    username : Sequelize.STRING,
    password : Sequelize.STRING,
});

const Alert = sequelize.define('Alert',{
   priceDecrease : Sequelize.INTEGER,
   time : Sequelize.TIME
})

Brand.hasMany(Product);
Product.belongsTo(Brand);

Retailer.hasMany(Store);
Store.belongsTo(Retailer);

Product.belongsToMany(Store,{through:Promotion});
Store.belongsToMany(Product,{through:Promotion});
// Promotion.hasMany(Store,{foreignKey:'storeId',sourceKey:'id'});

User.hasOne(Brand);
Brand.hasOne(User);

Product.hasMany(Alert);
Alert.belongsTo(Product);

sequelize.sync({forces:true}).then(()=>{
    console.log("Database synced");
})

module.exports = {
    "Brand" : Brand,
    "Retailer": Retailer,
    "Product" : Product,
    "Store" : Store,
    "Promotion": Promotion,
    "User" : User,
    'sequelize' : sequelize,
    "Alert" : Alert
}
