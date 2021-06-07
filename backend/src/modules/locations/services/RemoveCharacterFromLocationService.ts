import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ILocationsCharactersRepository from '@modules/locations/repositories/ILocationsCharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  location_id: string;
}

@injectable()
class RemoveCharacterFromLocationService {
  constructor(
    @inject('LocationsCharactersRepository')
    private locationsCharactersRepository: ILocationsCharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute({
    user_id,
    char_id,
    location_id,
  }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can remove character from a location',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can remove character from a location',
        401,
      );
    }

    const locChar = await this.locationsCharactersRepository.find(
      char_id,
      location_id,
    );

    if (!locChar) {
      throw new AppError('The character is not aware of this location', 400);
    }

    // Remove all LocationList routes
    await this.saveRouteResult.remove('LocationList:*');

    await this.locationsCharactersRepository.delete(char_id, location_id);
  }
}

export default RemoveCharacterFromLocationService;
