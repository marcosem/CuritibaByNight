import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ILocationAvailableTraitsRepository from '@modules/locations/repositories/ILocationAvailableTraitsRepository';
import LocationTrait from '@modules/locations/infra/typeorm/entities/LocationTrait';
import ILocationsTraitsRepository from '@modules/locations/repositories/ILocationsTraitsRepository';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequestDTO {
  user_id: string;
  trait_id: string;
  location_id: string;
  level?: number;
}

@injectable()
class UpdateTraitLocationService {
  constructor(
    @inject('LocationAvailableTraitsRepository')
    private locationAvailableTraitsRepository: ILocationAvailableTraitsRepository,
    @inject('LocationsTraitsRepository')
    private locationsTraitsRepository: ILocationsTraitsRepository,
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    trait_id,
    location_id,
    level = 1,
  }: IRequestDTO): Promise<LocationTrait> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add a trait to a location',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add a trait to a location',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    const locationAvailableTrait = await this.locationAvailableTraitsRepository.findById(
      trait_id,
    );

    if (!locationAvailableTrait) {
      throw new AppError('Trait not found', 400);
    }

    const currentLocationTrait = await this.locationsTraitsRepository.findByLocationIdAndTraitId(
      location_id,
      trait_id,
    );

    let newLocationTrait: LocationTrait;

    // If the location trait already exist, update it
    if (currentLocationTrait) {
      newLocationTrait = currentLocationTrait;

      const updatedLevel: number =
        Number(currentLocationTrait.level) + Number(level);

      // Remove the location trait if the level downs to zero or lower
      if (updatedLevel <= 0) {
        newLocationTrait.level = 0;

        await this.locationsTraitsRepository.delete(currentLocationTrait.id);
      } else {
        // Set Trait level to location capacity
        newLocationTrait.level =
          updatedLevel > location.level ? location.level : updatedLevel;

        await this.locationsTraitsRepository.updateTraitLocation(
          newLocationTrait,
        );
      }
    } else {
      newLocationTrait = await this.locationsTraitsRepository.addTraitToLocation(
        {
          location_id,
          trait_id,
          level: level > location.level ? location.level : level,
        },
      );
    }

    return newLocationTrait;
  }
}

export default UpdateTraitLocationService;
