import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Location from '@modules/locations/infra/typeorm/entities/Location';
import ILocationsRepository from '@modules/locations/repositories/ILocationsRepository';
import ICharactersRepository from '@modules/characters/repositories/ICharactersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ISaveRouteResultProvider from '@shared/container/providers/SaveRouteResultProvider/models/ISaveRouteResultProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import { resolve } from 'path';

interface IRequestDTO {
  user_id: string;
  name: string;
  description: string;
  address?: string;
  latitude: number;
  longitude: number;
  elysium?: boolean;
  type?: string;
  level?: number;
  mystical_level?: number;
  property?: string;
  clan?: string;
  creature_type?: string;
  sect?: string;
  char_id?: string;
}

@injectable()
class CreateLocationService {
  constructor(
    @inject('LocationsRepository')
    private locationsRepository: ILocationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CharactersRepository')
    private charactersRepository: ICharactersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('SaveRouteResultProvider')
    private saveRouteResult: ISaveRouteResultProvider,
  ) {}

  public async execute({
    user_id,
    name,
    description,
    address,
    latitude,
    longitude,
    elysium,
    type,
    level,
    mystical_level,
    property,
    clan,
    creature_type,
    sect,
    char_id,
  }: IRequestDTO): Promise<Location> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated Storytellers can add locations',
        401,
      );
    } else if (!user.storyteller) {
      throw new AppError(
        'Only authenticated Storytellers can add locations',
        401,
      );
    }

    let player: User | undefined;
    let char_name: string | undefined;
    let char_situation: string | undefined;

    if (char_id) {
      const char = await this.charactersRepository.findById(char_id);

      if (!char) {
        throw new AppError('Character not found', 400);
      }

      char_name = char.name;
      char_situation = char.situation;

      if (char.user_id)
        player = await this.usersRepository.findById(char.user_id);
    }

    // Remove all LocationList routes
    await this.saveRouteResult.remove('LocationList:*');

    const location = await this.locationsRepository.create({
      name,
      description,
      address,
      latitude,
      longitude,
      elysium,
      type,
      level,
      mystical_level,
      property,
      clan,
      creature_type,
      sect,
      responsible: char_id,
    });

    if (player && char_name && char_situation === 'active') {
      const locationUpdateTemplate = resolve(
        __dirname,
        '..',
        'views',
        'character_location_add.hbs',
      );

      const userNames = player.name.split(' ');

      await this.mailProvider.sendMail({
        to: {
          name: player.name,
          email: player.email,
        },
        subject: `[Curitiba By Night] Localização atualizada para o Personagem '${char_name}' no mapa do sistema`,
        templateData: {
          file: locationUpdateTemplate,
          variables: {
            name: userNames[0],
            loc_name: location.name,
            loc_desc: location.description,
            char_name,
            link: `${process.env.APP_WEB_URL}/locals/${location.id}`,
            imgLogo: 'curitibabynight.png',
            imgMap: 'curitiba_old_map.jpg',
          },
        },
      });
    }

    return location;
  }
}

export default CreateLocationService;
