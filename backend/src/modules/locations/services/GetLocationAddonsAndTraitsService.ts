import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import LocationAddon from '@modules/locations/infra/typeorm/entities/LocationAddon';
import LocationTrait from 'modules/locations/infra/typeorm/entities/LocationTrait';
import ILocationsAddonsRepository from '@modules/locations/repositories/ILocationsAddonsRepository';
import ILocationsTraitsRepository from '@modules/locations/repositories/ILocationsTraitsRepository';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import IAddonsRepository from '@modules/locations/repositories/IAddonsRepository';
import ILocationAvailableTraitsRepository from '@modules/locations/repositories/ILocationAvailableTraitsRepository';
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
  traitsList: LocationTrait[];
}

@injectable()
class GetLocationAddonsAndTraitsService {
  constructor(
    @inject('LocationsAddonsRepository')
    private locationsAddonsRepository: ILocationsAddonsRepository,
    @inject('LocationsTraitsRepository')
    private locationsTraitsRepository: ILocationsTraitsRepository,
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('AddonsRepository')
    private addonsRepository: IAddonsRepository,
    @inject('locationAvailableTraitsRepository')
    private locationAvailableTraitsRepository: ILocationAvailableTraitsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharactersRepository')
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
        'Only authenticated user can get location addons/traits list',
        401,
      );
    } else if (!user.storyteller && !char_id) {
      throw new AppError(
        'Only authenticated Storytellers can get location addons/traits list without identify a character',
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
    const defenseKeysAbilities: string[] = [];
    const surveillanceKeysAbilities: string[] = [];

    let defense = 5 + parseInt(`${location.level}`, 10);
    let surveillance = 5 + parseInt(`${location.level}`, 10);
    const removeAddonsList: string[] = [];

    if (locationAddons.length > 0) {
      await new Promise<void>((resolve, _) => {
        locationAddons.forEach(async (locAddon, index, myArray) => {
          const addonId = locAddon.addon_id_current;

          if (addonId !== null) {
            const addon = await this.addonsRepository.findById(addonId);

            if (addon) {
              // data from DB comes as string, need to ensure it is integer for comparision
              const addonDefense: number = parseInt(`${addon.defense}`, 10);
              const addonSurveillance: number = parseInt(
                `${addon.surveillance}`,
                10,
              );

              // Sum the defense points
              if (addonDefense > 0) {
                defense += addonDefense;

                // Get the keys abilities for defense
                const keyAbilities = addon.ability.split(', ');
                defenseKeysAbilities.push(...keyAbilities);
              }

              // Sum the surveillance points
              if (addonSurveillance > 0) {
                surveillance += addonSurveillance;

                // Get the keys abilities for surveillance
                const keyAbilities = addon.ability.split(', ');
                surveillanceKeysAbilities.push(...keyAbilities);
              }
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
    }

    if (removeAddonsList.length > 0) {
      locationAddons = locationAddons.filter(
        locAddon => removeAddonsList.indexOf(locAddon.id) === -1,
      );

      removeAddonsList.forEach(async locAddonId => {
        await this.locationsAddonsRepository.delete(locAddonId);
      });
    }

    // Get the location traits
    const locationTraits = await this.locationsTraitsRepository.listTraitsByLocation(
      location.id,
    );
    let filteredLocationTraits: LocationTrait[] = locationTraits;

    // Looks for the key abilies for defense e surveillance
    if (locationTraits.length > 0) {
      const locationAbilitiesTraits = [];
      const invalidLocationTraits: LocationTrait[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const locTrait of locationTraits) {
        // eslint-disable-next-line no-await-in-loop
        const locAvaiTrait = await this.locationAvailableTraitsRepository.findById(
          locTrait.trait_id,
        );

        if (locAvaiTrait === undefined) {
          invalidLocationTraits.push(locTrait);
        } else {
          const newLocTrait = {
            trait: locAvaiTrait.trait,
            type: locAvaiTrait.type,
            level: locTrait.level,
          };

          if (newLocTrait.type === 'abilities') {
            locationAbilitiesTraits.push(newLocTrait);
          }
        }
      }

      // Handle invalid traits
      if (invalidLocationTraits.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const invLocTrait of invalidLocationTraits) {
          // eslint-disable-next-line no-await-in-loop
          await this.locationsTraitsRepository.delete(invLocTrait.id);
        }

        filteredLocationTraits = locationTraits.filter(
          locTrait => invalidLocationTraits.indexOf(locTrait) < 0,
        );
      }

      if (defenseKeysAbilities.length > 0) {
        const defenseAbilities = locationAbilitiesTraits.filter(
          locTrait => defenseKeysAbilities.indexOf(locTrait.trait) >= 0,
        );

        if (defenseAbilities.length > 0) {
          const traitDefense = Math.max(
            ...defenseAbilities.map(locTrait => locTrait.level),
          );

          defense += traitDefense;
        }
      }

      if (surveillanceKeysAbilities.length > 0) {
        const surveillanceAbilities = locationAbilitiesTraits.filter(
          locTrait => surveillanceKeysAbilities.indexOf(locTrait.trait) >= 0,
        );

        if (surveillanceAbilities.length > 0) {
          const traitSurveillance = Math.max(
            ...surveillanceAbilities.map(locTrait => locTrait.level),
          );

          surveillance += traitSurveillance;
        }
      }
    }

    const locationAddonsResult: ILocationAddonsResult = {
      defense,
      surveillance,
      addonsList: locationAddons,
      traitsList: filteredLocationTraits,
    };

    return locationAddonsResult;
  }
}

export default GetLocationAddonsAndTraitsService;
