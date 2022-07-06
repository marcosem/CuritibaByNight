import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';
import ILocationAvailableTraitsRepository from '@modules/locations/repositories/ILocationAvailableTraitsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  loc_avai_traits: LocationAvailableTrait[];
}

@injectable()
class AddLocationAvailableTraitsServices {
  constructor(
    @inject('LocationAvailableTraitsRepository')
    private LocationAvailableTraitsRepository: ILocationAvailableTraitsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    loc_avai_traits,
  }: IRequestDTO): Promise<LocationAvailableTrait[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add location available traits',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add location available traits',
        401,
      );
    }

    if (loc_avai_traits.length === 0) {
      throw new AppError('No location available traits to be added', 400);
    }

    // Remove duplicated
    const locAvaiTraitsList = await this.LocationAvailableTraitsRepository.listAll();
    const newLocAvaiTraits = loc_avai_traits.filter(
      locAvaiTrait =>
        locAvaiTraitsList.findIndex(
          savedTrait =>
            savedTrait.trait === locAvaiTrait.trait &&
            savedTrait.type === locAvaiTrait.type,
        ) < 0,
    );

    let savedLocAvaiTraitList: LocationAvailableTrait[] = [];

    if (newLocAvaiTraits.length > 0) {
      savedLocAvaiTraitList = await this.LocationAvailableTraitsRepository.createList(
        newLocAvaiTraits,
      );
    }

    return savedLocAvaiTraitList;
  }
}

export default AddLocationAvailableTraitsServices;
