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

    const stores  = await Db.sequelize.query('SELECT id,name FROM (Stores INNER JOIN Promotions) where Promotions.ProductId = :prdId',{
        replacements : {prdId : req.params.productId},
        type : Sequelize.QueryTypes.SELECT
    });
    
    let sellingStores = [];
    stores.forEach(element => {
        sellingStores.push(element.id);
    });

    const nonSellingStores  = await Db.sequelize.query('SELECT id FROM Stores where id not in (:stores)',{
        replacements : {stores:sellingStores},
        type : Sequelize.QueryTypes.SELECT
    });

    res.json({sellingStores:stores,nonSellingStores:nonSellingStores});
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
    const promotion = await Db.Promotion.update({
        discount : req.params.discount,
    },{
        where : {
            ProductId : req.params.productId,
            StoreId : req.params.storeId
        }
    })

    res.json(promotion);
}

module.exports = {
    "getProducts" : getProducts,
    "getStores" : getStores,
    "applyPromotion" : applyPromotion,
}