import { getCustomRepository } from 'typeorm';
import Product from '../models/Product';
import ProductRepository from '../repositories/ProductsRepository';
import UserRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  name: string;
  description: string;
  owner_id: string;
  price: number;
  price_old: number;
}

class CreateProductService {
  public async execute({
    name,
    description,
    owner_id,
    price,
    price_old,
  }: RequestDTO): Promise<Product> {
    const usersRepository = getCustomRepository(UserRepository);

    // Verify if user exist
    const userExist = await usersRepository.findByIds([owner_id]);
    if (userExist.length === 0) {
      throw new AppError(
        'Invalid Owner Id, the product require a valid user.',
        401,
      );
    }

    // Verify if user already have this product
    const productsRepository = getCustomRepository(ProductRepository);
    const productNameExist = await productsRepository.findProductByName(
      name,
      owner_id,
    );
    if (productNameExist) {
      throw new AppError(
        'The user already have a product with this name.',
        409,
      );
    }

    // create product
    const product = productsRepository.create({
      name,
      description,
      owner_id,
      price,
      price_old,
    });

    await productsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
