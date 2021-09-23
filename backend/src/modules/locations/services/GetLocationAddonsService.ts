import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import LocationAddon from '@modules/locations/infra/typeorm/entities/LocationAddon';
import ILocationsAddonsRepository from '@modules/locations/repositories/ILocationsAddonsRepository';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';

interface IRequestDTO {
  user_id: string;
  char_id?: string;
  location_id: string;
}

interface ILocationAddonsResult {
  defense: number;
  surveillance: number;
  addonsList: LocationAddon[];
}

@injectable()
class GetLocationAddonsService {
  constructor(
    @inject('LocationsAddonsRepository')
    private locationsAddonsRepository: ILocationsAddonsRepository,
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('AddonsRepository')
    private addonsRepository: IAddonsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharacterRepository')
    private charactersRepository: ICharactersRepository,
    @inject('LocationsCharactersRepository')
    private locationsCharactersRepository: ILocationsCharactersRepository,
  ) {}

  public async execute({
    user_id,
    char_id,
    location_id,
  }: IRequestDTO): Promise<ILocationAddonsResult> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated user can get location addons list',
        401,
      );
    } else if (!user.storyteller && !char_id) {
      throw new AppError(
        'Only authenticated Storytellers can get location addons list without identify a character',
        401,
      );
    }

    const location = await this.locationsRepository.findById(location_id);

    if (!location) {
      throw new AppError('Location not found', 400);
    }

    if (char_id) {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      if (
        !(location.property === 'clan' && location.clan === char.clan) &&
        location.responsible !== char_id
      ) {
        const locChar = await this.locationsCharactersRepository.find(
          char_id,
          location_id,
        );

        if (locChar !== undefined && locChar.shared === false) {
          throw new AppError(
            'The character does not have access to this location',
            401,
          );
        }
      }
    }

    let locationAddons = await this.locationsAddonsRepository.listAddonsByLocation(
      location_id,
    );

    let defense = 0;
    let surveillance = 0;
    const removeAddonsList: string[] = [];

    await new Promise<void>((resolve, _) => {
      locationAddons.forEach(async (locAddon, index, myArray) => {
        const addonId = locAddon.addon_id_current;

        if (addonId !== null) {
          const addon = await this.addonsRepository.findById(addonId);

          if (addon) {
            defense += addon.defense;
            surveillance += addon.surveillance;
          } else {
            removeAddonsList.push(locAddon.id);
          }
        }

        if (index === myArray.length - 1) {
          // Add a small delay just to ensure everything is processed
          setTimeout(() => {
            resolve();
          }, 50);
        }
      });
    });

    if (removeAddonsList.length > 0) {
      locationAddons = locationAddons.filter(
        locAddon => removeAddonsList.indexOf(locAddon.id) === -1,
      );

      removeAddonsList.forEach(async locAddonId => {
        await this.locationsAddonsRepository.delete(locAddonId);
      });
    }

    const locationAddonsResult: ILocationAddonsResult = {
      defense,
      surveillance,
      addonsList: locationAddons,
    };

    return locationAddonsResult;
  }
}

export default GetLocationAddonsService;
