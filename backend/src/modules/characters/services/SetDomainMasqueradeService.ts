import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/models/IDomainMasqueradeProvider';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';

interface IRequestDTO {
  user_id: string;
  masquerade_level: number;
}

@injectable()
class SetDomainMasqueradeService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('DomainMasqueradeProvider')
    private domainMasqueradeProvider: IDomainMasqueradeProvider,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute({
    user_id,
    masquerade_level,
  }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can upload character sheets',
        401,
      );
    }

    // Remove this saved route when changing domain masquerade
    this.saveRouteResult.remove('CharactersInfluences');

    const result = this.domainMasqueradeProvider.set(masquerade_level);

    if (!result) {
      throw new AppError(
        'The masquerade level should be between 0 and 10',
        400,
      );
    }
  }
}

export default SetDomainMasqueradeService;
