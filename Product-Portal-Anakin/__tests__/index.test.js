const request = require('supertest');
const app = require('../index'); 
const {sequelize} = require('../models/models');
const populate = require('../../pop');

// let brandId1, brandId2, brandId3, brandId4;

// beforeAll(async () => {
//   // clean the database before running tests
//   await sequelize.truncate({ cascade: true });
// });

describe('POST /register', () => {
    it('should create a new user', async () => {
      const userData1 = { username: 'user0_6', password: 'password123' };
      const userData2 = { username: 'TestUser_2', password: 'password123' };
      const userData3 = { username: 'TestUser_3', password: 'password123' };
      const userData4 = { username: 'TestUser_4', password: 'password123' };

      const resp1 = await request(app)
        .post('/register')
        .send(userData1);

      global.brandId = resp1.brandId;
      brandId2 = await request(app).post('/register').send(userData2).brandId;
      brandId3 = await request(app).post('/register').send(userData3).brandId;
      brandId4 = await request(app).post('/register').send(userData4).brandId;
      
      expect(resp1.statusCode).toBe(201);
      expect(resp1.body).toHaveProperty('brandId');
      expect(resp1.body.username).toBe(userData1.username);
    });

    it('should not create a user with exiting username', async()=>{
      const userData = { username: 'TestUser_4', password: 'password123' };
      const response = await request(app)
        .post('/register')
        .send(userData);
      expect(response.statusCode).toBe(401);
    })
});

populate();

describe('POST /login', () => {
  it('login a user', async () => {
    const userData = { username: 'TestUser_4', password: 'password123' };
    const response = await request(app)
      .post('/login')
      .send(userData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.message).toBe('login successful');
  
  });
  it('should not login a user with incorrect password', async()=>{
    const userData = { username: 'TestUser_4', password: 'random' };
    const response = await request(app)
      .post('/login')
      .send(userData);
    expect(response.statusCode).toBe(401);
  });

});

let productId;
describe('POST /products/create',()=>{
  beforeAll(async () => {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (global.brandId) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  });

  it('create a product', async ()=>{
    const prodData1 = {name:'testProduct1', brandId: global.brandId};
    console.log("brand id is ",global.brandId)
    const resp1 = await request(app).post('/products/create').send(prodData1);
    productId = resp1.id;

    expect(resp1.statusCode).toBe(200);
    expect(resp1.body).toHaveProperty('brandId');
    expect(resp1.body.name).toBe(prodData1.name);

  });

  it('should not create a product without a brand', async ()=>{
    const prodData1 = {name:'testProduct1'};
    const resp1 = await request(app).post('/products/create').send(prodData1);

    expect(resp1.statusCode).toBe(400);
  })

});

let retailerId;
describe('POST /retailers/create', ()=>{
  it('should create a retailer', async ()=>{
    const retailer = {name:'testRetailer'};
    const resp = await request(app).post('/retailers/create').send(retailer);
    retailerId = resp.id;

    expect(resp.statusCode).toBe(200);
    
  });
  
});

let storeId;
describe('POST /stores/create',()=>{
  it('should create a store', async()=>{
    const store = {name:'testStore',retailerId:retailerId};
    const resp =  await request(app).post('/stores/create').send(store);
    storeId = resp.id;

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toHaveProperty('id');

  });

  it('should not create a store without a retailer', async ()=>{
    const store = {name:'testStore'};
    const resp =  await request(app).post('/stores/create').send(store);

    expect(resp.statusCode).toBe(400);

  })
});

describe('POST /products/list',()=>{
  it('should list a product at a store', async()=>{
    const listing = {productId:productId,storeId:storeId};
    const resp = await request(app).post('/products/list').send(listing);

    expect(resp.statusCode).toBe(200);
  
  })
});

describe('GET /products/:brandId', ()=>{
  it('should get all the products of a brand',async()=>{
    const resp = await request(app).get(`/products/${brandId1}`);

  })
});


