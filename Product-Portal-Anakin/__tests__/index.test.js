const request = require('supertest');
const app = require('../index'); 
const {sequelize} = require('../models/models');

let brandId1, brandId2, brandId3, brandId4;

// beforeAll(async () => {
//   // clean the database before running tests
//   await sequelize.truncate({ cascade: true });
// });

describe('POST /register', () => {
    it('should create a new user', async () => {
      const userData1 = { username: 'TestUser_1', password: 'password123' };
      const userData2 = { username: 'TestUser_2', password: 'password123' };
      const userData3 = { username: 'TestUser_3', password: 'password123' };
      const userData4 = { username: 'TestUser_4', password: 'password123' };

      const resp1 = await request(app)
        .post('/register')
        .send(userData1);

      brandId1 = resp1.brandId;
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
        .send(user1Data);
      expect(response.statusCode).toBe(401);
    })
});

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

describe('POST /products/create',()=>{
  it('create a product', async ()=>{
    const prodData1 = {name:'testProduct1', brandId: brandId1};
    const resp1 = await request(app).post('/products/create').send(prodData1);

    expect(resp1.statusCode).toBe(201);
    expect(resp1.body).toHaveProperty('brandId');
    expect(resp1.body.name).toBe(prodData1.name);

    //create 
  });

  it('should not create a product without a brand', async ()=>{
    const prodData1 = {name:'testProduct1'};
    const resp1 = await request(app).post('/products/create').send(prodData1);

    expect(resp1.statusCode).toBe(402);
  })

})
