const { Sequelize } = require('sequelize');
const Db = require('../models/models');


const getProducts = async (req,res) => {
    const products = await Db.Product.findAll({
        where : {
            brandId : req.params.brandId
        }
    });
    res.json({products:products});
};

const getStores = async (req,res) => {

    const sellingStores  = await Db.sequelize.query('SELECT id,name FROM (Stores INNER JOIN Promotions) where Promotions.ProductId = :prdId',{
        replacements : {prdId : req.params.productId},
        type : Sequelize.QueryTypes.SELECT
    });
    
    let sellingStoresId = [];
    sellingStores.forEach(element => {
        sellingStoresId.push(element.id);
    });

    const nonSellingStores  = await Db.sequelize.query('SELECT id,name FROM Stores where id not in (:stores)',{
        replacements : {stores:sellingStoresId},
        type : Sequelize.QueryTypes.SELECT
    });

    res.json({sellingStoresId:sellingStores,nonsellingStoresId:nonSellingStores});
};

const applyPromotion = async (req,res) => {
    const existingPromotion = await Db.Promotion.findOne({
        where : {
            ProductId :req.params.productId,
            StoreId : req.params.storeId
        }
    });
    if(existingPromotion.discount < req.params.discount){
        const alert = Db.Alert.create({
            priceDecrease : (req.params.discount - existingPromotion.discount),
            // time : now()
        });
    }
    const newPromotion = await Db.Promotion.update({
        discount : req.params.discount,
    },{
        where : {
            ProductId : req.params.productId,
            StoreId : req.params.storeId
        }
    })

    res.json(newPromotion);
}

const createNewProduct = async (req,res)=>{
    let product;
    if(!req.brandId){
        return res.status(402).json({message:'missing brandId in body'});
    }
    try{
        product = await Db.Product.create({
            name : req.body.name,
            BrandId : req.body.brandId,
        });
    }
    catch(err){
        console.log(err);
        res.status.json({message:'internal server error'});
    }      

    res.json({product:product});
}

const createRetailer = async (req,res) =>{
    let retailer;
    try{
        retailer = await Db.Retailer.create({
            name : req.body.name,
        });
    }
    catch(err){
        console.log(err);
        res.status.json({message:'internal server error'});
    }

    res.json({retailer:retailer}); 
}

const createStore = async (req,res) =>{
    let store;
    try{
        store = await Db.Store.create({
            name : req.body.name,
            StoreId : req.body.storeId,
        })
    }
    catch(err){
        console.log(err);
        res.status.json({message:'internal server error'});
    }

    res.json({store:store});
}

const listProduct  = async (req,res) =>{
    let promotion;
    try{
        promotion = await Db.Promotion.create({
            productId : req.body.productId,
            StoreId : req.body.storeId,
            discount : 0,
        })
    }
    catch(err){
        console.log(err);
        res.status.json({message:'internal server error'});
    }

    res.json({message : `Product ${req.body.productId} listed at store ${req.body.storeId} `});
}

module.exports = {
    "getProducts" : getProducts,
    "getStores" : getStores,
    "applyPromotion" : applyPromotion,
    "createNewProduct" : createNewProduct,
    "createRetailer" : createRetailer,
    "createStore" : createStore,
    "listProduct" : listProduct
}