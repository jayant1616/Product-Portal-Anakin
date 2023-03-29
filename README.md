### Product Portal

- The project runs on Node.js using Express.js

- To install Dependencies:
```
cd Product-Portal-Anakin 
```
```
npm install
```

- To run server :
```
npm start
```

- Setting up database : 

    This project uses Mysql as the database. Create a database named `product_portal_db` in the local mysql server. Replace the credentials in `./Product_Portal-Anakin/.env.development` with local mysql server credentials.


------------------------------------------------------------------------------------------

#### Creating a new user and login

<details>
 <summary><code>POST</code> <code><b>/register</b></code> <code>(creates a new user and a brand)</code></summary>

##### body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username      |  required | string   | unique username  |
> | password    |  required | string   | password for the user  |
> | brandname      |  required | string   | brand name   |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`        | `{username:,token,brandId:}`                                |
> | `401`         | `application/json`                | `{message : "username already in use"}`                            |

</details>

<details>
 <summary><code>POST</code> <code><b>/login</b></code> <code>(creates a new user and a brand)</code></summary>

##### body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username      |  required | string   | unique username  |
> | password    |  required | string   | password for the user  |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | `{"message": "","token": "brandId": }`                            |
> | `401`         | `application/json`                | `{message : "not authorised"}`                            |

</details>

------------------------------------------------------------------------------------------

#### Product APIs

<details>
 <summary><code>GET</code> <code><b>/products/:brandId</b></code> <code>(gets all the products of a brand)</code></summary>

##### Parameters

> | name              |  type     | data type      | description                         |
> |-------------------|-----------|----------------|-------------------------------------|
> | `brandId` |  required | int ($int64)   | The unique brand Id       |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | An array containing all the products                                                       |


</details>

<details>
 <summary><code>GET</code> <code><b>/:productId/stores</b></code> <code>(gets all the stores that a product is listed at)</code></summary>

##### Parameters

> | name              |  type     | data type      | description                         |
> |-------------------|-----------|----------------|-------------------------------------|
> | `productId` |  required | int ($int64)   | The specific product id        |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`        | array containing the stores                                                         |


##### Example cURL

</details>

<details>
  <summary><code>POST</code> <code><b>/products/create</b></code> <code>(create a new product for a brand)</code></summary>

##### Body

> | name   |  type      | data type      | description                                          |
> |--------|------------|----------------|------------------------------------------------------|
> | `brandId` |  required  | int         | The brand unique idendifier id                  |

##### Responses

> | http code     | content-type                      | description        |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`        | product created succesfully                                                    |
> | `400`         | `application/json`                | `bad request, brandId is missing`                            |

</details>


<details>
  <summary><code>POST</code> <code><b>/products/list</b></code> <code>(list a product at a store)</code></summary>

##### Body
> | name   |  type      | data type      | description                                          |
> |--------|------------|----------------|------------------------------------------------------|
> | `productId` |  required  | int         | The product id of the product to be listed 
> | `storeId` |  required  | int         | The store id of the store where product is to be listed at      


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`        | `{message : `Product_id listed at store store_id `}`                         |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |

</details>



------------------------------------------------------------------------------------------


#### Creating Retailers, Stores

<details>
  <summary><code>POST</code> <code><b>/retailers/create</b></code> <code>(create a new retailer)</code></summary>

##### Body

> | name              |  type     | data type      | description                         |
> |-------------------|-----------|----------------|-------------------------------------|
> | `name` |  required | int ($int64)   | retailer name        |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`        | `retailer json object`        |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `500`         | `application/json`         | `{internal server error}`                                                                |

</details>

<details>
  <summary><code>POST</code> <code><b>/stores/create</b></code> <code>(create a store for a retailer)</code></summary>

##### Body

> | name   |  type      | data type      | description                                          |
> |--------|------------|----------------|------------------------------------------------------|
> | `retailerId` |  required  | int         | The id for the retailer creating the store         |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`        | `created store`                     |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |
> | `500`         | `application/json`         |   `internal server error`                               |

</details>

------------------------------------------------------------------------------------------

#### Apply promotions to products at retail stores

<details>
 <summary><code>GET</code> <code><b>/promotions/:productId/:storeId/:discount</b></code> <code>(applies promotion on a product at a particular store)</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | productId    |  required | int   | Product id  |
> |   storeId  |  required | int   | store id  |
> |   discount  |  required | float   | discount to be applied  |

##### Headers

> | name      |  type     | description| 
> |-----------|-----------|------------|
> | jwt-token-x    |  required | The JWT token returned by login API   | 

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `201`         | `application/json`        | `promotion object`                                |
> | `400`         | `application/json`                | `{"code":"400","message":"Bad Request"}`                            |                                                              
</details>

------------------------------------------------------------------------------------------

