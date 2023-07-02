import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IDomainMasqueradeProvider from '@modules/characters/providers/DomainMasqueradeProvider/models/IDomainMasqueradeProvider';

interface IRequestDTO {
  user_id: string;
}

@injectable()
class SetDomainMasqueradeService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('DomainMasqueradeProvider')
    private domainMasqueradeProvider: IDomainMasqueradeProvider,
  ) {}

  public async execute({ user_id }: IRequestDTO): Promise<number> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can get domain masquerade level',
        401,
      );
    }

    return this.domainMasqueradeProvider.get();
  }
}

export default SetDomainMasqueradeService;
