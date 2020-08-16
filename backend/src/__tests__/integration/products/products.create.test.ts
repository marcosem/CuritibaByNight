import request from 'supertest';
import { isUuid, uuid } from 'uuidv4';
import { parseISO, isToday } from 'date-fns';
import app from '../../../app';

describe('Products Routes', () => {
  interface Product {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    price: number;
    price_old: number;
    created_at: string;
    updated_at: string;
  }

  // let products;
  let owner_id: string;

  // It is necessary to add a user, so that you can add products for him
  beforeAll(async () => {
    const userInput = {
      name: 'User Owner',
      login: 'userOwner',
      email: 'userOwner@test.com',
      password: '1234567',
    };

    const response = await request(app).post('/users/create').send(userInput);

    owner_id = response.body.id;
  });

  // afterAll(async () => {});

  // Add two different users and verify if they are correctly added
  it('Create Product <Product One> - Expect Product created with a valid id', async () => {
    const product = {
      name: 'Product One',
      description: 'Product with One',
      owner_id,
      price: 10.5,
      price_old: null,
    };

    const productTemplate = {
      name: expect.stringMatching('Product One'),
      description: expect.stringMatching('Product with One'),
      owner_id: expect.any(String),
      price: expect.any(Number),
      price_old: expect.any(Number),
    };

    const response = await request(app).post('/products/create').send(product);

    // Expect User information to be returned
    expect(response.body).toMatchObject(productTemplate);

    // Expect to have a valid user id
    expect(isUuid(response.body.id)).toBe(true);
  });

  it('Create Product <Product Two> - Expect Product created with a valid id', async () => {
    const product = {
      name: 'Product Two',
      description: 'Product with Two',
      owner_id,
      price: 10,
      price_old: 20.99,
    };

    const productTemplate = {
      name: expect.stringMatching('Product Two'),
      description: expect.stringMatching('Product with Two'),
      owner_id: expect.any(String),
      price: expect.any(Number),
      price_old: expect.any(Number),
    };

    const response = await request(app).post('/products/create').send(product);

    // Expect User information to be returned
    expect(response.body).toMatchObject(productTemplate);

    // Expect to have a valid user id
    expect(isUuid(response.body.id)).toBe(true);
  });

  // Try add a duplicate produ
  it('Try add a duplicate product for the same user - Expect error message', async () => {
    const product = {
      name: 'Product One',
      description: 'Product with One',
      owner_id,
      price: 10.5,
      price_old: null,
    };

    const response = await request(app).post('/products/create').send(product);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  // Try add product with new pricer higher than old price
  it('Try add product with new pricer higher than old price - Expect error message', async () => {
    const product = {
      name: 'Product Three',
      description: 'Product with Three',
      owner_id,
      price: 10.5,
      price_old: 9.5,
    };

    const response = await request(app).post('/products/create').send(product);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  // Try add product with invalid owner id
  it('Try add product with invalid owner id - Expect error message', async () => {
    const product = {
      name: 'Product Invalid Id',
      description: 'Product with Invalid Id',
      owner_id: 'invalid',
      price: 10.5,
      price_old: null,
    };

    const response = await request(app).post('/products/create').send(product);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  // Try add product with non existant owner id
  it('Try add product with non existant owner id - Expect error message', async () => {
    const product = {
      name: 'Product Invalid Id',
      description: 'Product with Invalid Id',
      owner_id: uuid(),
      price: 10.5,
      price_old: null,
    };

    const response = await request(app).post('/products/create').send(product);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  // List all products, it should return two valid elements
  it('List Products - Expect two valid products', async () => {
    const productTemplate = [
      {
        name: expect.any(String),
        description: expect.any(String),
        owner_id: expect.any(String),
        price: expect.any(Number),
        price_old: expect.any(Number),
      },
      {
        name: expect.any(String),
        description: expect.any(String),
        owner_id: expect.any(String),
        price: expect.any(Number),
        price_old: expect.any(Number),
      },
    ];

    const response = await request(app).get(`/products/list/${owner_id}`);

    // Verify body contains an array of two valid objects
    expect(response.body).toMatchObject(productTemplate);

    // Verify if each object contains user id and createdAt properties
    response.body.forEach((product: Product) => {
      // Expect to have a valid user id
      expect(isUuid(product.id)).toBe(true);
      // Expect to have a valid creation date
      expect(isToday(parseISO(product.created_at))).toBe(true);
    });
  });
});
