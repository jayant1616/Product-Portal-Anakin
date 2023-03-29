const { Sequelize } = require('sequelize');
const Db = require('../models/models');


const getProducts = async (req,res) => {
    let products;
    try{
        products = await Db.Product.findAll({
            where : {
                brandId : req.params.brandId
            }
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'internal server error'});
    }
    res.json({products:products});
};

const getStores = async (req,res) => {
    let sellingStores, nonSellingStores;
    try{
        sellingStores  = await Db.sequelize.query('SELECT id,name FROM (Stores INNER JOIN Promotions) where Promotions.ProductId = :prdId',{
            replacements : {prdId : req.params.productId},
            type : Sequelize.QueryTypes.SELECT
        });
        
        let sellingStoresId = [];
        sellingStores.forEach(element => {
            sellingStoresId.push(element.id);
        });

        nonSellingStores  = await Db.sequelize.query('SELECT id,name FROM Stores where id not in (:stores)',{
            replacements : {stores:sellingStoresId},
            type : Sequelize.QueryTypes.SELECT
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'internal server error'});
    }
    res.json({sellingStoresId:sellingStores,nonsellingStoresId:nonSellingStores});
};

const applyPromotion = async (req,res) => {
    let newPromotion;
    try{
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
        newPromotion = await Db.Promotion.update({
            discount : req.params.discount,
        },{
            where : {
                ProductId : req.params.productId,
                StoreId : req.params.storeId
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'internal server error'});
    }
    res.json(newPromotion);
}

const createNewProduct = async (req,res)=>{
    let product;
    if(req.body.brandId === undefined){
        return res.status(400).json({message:'missing brandId in body'});
    }
    try{
        product = await Db.Product.create({
            name : req.body.name,
            BrandId : req.body.brandId,
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'internal server error', error : err});
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
        res.status(500).json({message:'internal server error'});
    }

    res.json({retailer:retailer}); 
}

const createStore = async (req,res) =>{
    let store;
    if(req.body.retailerId === undefined){
        return res.status(400).json({message:'missing retailerId in body'});
    }

    try{
        store = await Db.Store.create({
            name : req.body.name,
            RetailerId : req.body.retailerId,
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'internal server error'});
    }

    res.json({store:store});
}

const listProduct  = async (req,res) =>{
    let promotion;
    if(req.body.productId === undefined || req.body.storeId === undefined){
        return res.status(400).json({message:'productId or storeId missing in request body'});
    }
    try{
        promotion = await Db.Promotion.create({
            ProductId : req.body.productId,
            StoreId : req.body.storeId,
            discount : 0,
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:'internal server error'});
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