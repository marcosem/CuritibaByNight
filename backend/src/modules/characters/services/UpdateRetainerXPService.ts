import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import calculateRetainerXP from '@modules/characters/utils/calculateRetainerXP';

interface IRequestDTO {
  user_id: string;
  char_id: string;
  situation: string;
}

@injectable()
class UpdateRetainerXPService {
  constructor(
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    char_id,
    situation,
  }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated users can update retainers XP',
        401,
      );
    }

    const char = await this.charactersRepository.findById(char_id);

    if (!char) {
      throw new AppError('Character not found', 400);
    }

    if (!user.storyteller && user_id !== char.user_id) {
      throw new AppError(
        'Only authenticated Storytellers can update retainers XP',
        401,
      );
    }

    const retainersList = await this.charactersRepository.listRetainers(
      char_id,
      situation,
    );

    retainersList.forEach(async retainer => {
      if (retainer.npc) {
        const newRetainer = retainer;

        const newTotalXP = calculateRetainerXP({
          retainerLevel: newRetainer.retainer_level,
          regnantXP: char.experience_total,
        });

        if (Math.round(newRetainer.experience_total) !== newTotalXP) {
          const difXP = newTotalXP - Math.round(newRetainer.experience_total);

          newRetainer.experience_total = newTotalXP;
          newRetainer.experience = Math.round(newRetainer.experience) + difXP;
          await this.charactersRepository.update(newRetainer);
        }
      }
    });
  }
}

export default UpdateRetainerXPService;
