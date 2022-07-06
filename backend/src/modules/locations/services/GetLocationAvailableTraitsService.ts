import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';
import ILocationAvailableTraitsRepository from '@modules/locations/repositories/ILocationAvailableTraitsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  trait_type?: string;
}

@injectable()
class GetLocationAvailableTraitsService {
  constructor(
    @inject('LocationAvailableTraitsRepository')
    private LocationAvailableTraitsRepository: ILocationAvailableTraitsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    trait_type,
  }: IRequestDTO): Promise<LocationAvailableTrait[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can get location available traits list',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can get location available traits list',
        401,
      );
    }

    const locAvaiTraitsList = await this.LocationAvailableTraitsRepository.listLocationAvailableTraitsByType(
      trait_type,
    );

    return locAvaiTraitsList;
  }
}

export default GetLocationAvailableTraitsService;
