import { getRepository, Repository } from 'typeorm';
import Territory from '@modules/locations/infra/typeorm/entities/Territory';
import ICreateTerritoryDTO from '@modules/locations/dtos/ICreateTerritoryDTO';
import ITerritoryRepository from '@modules/locations/repositories/ITerritoryRepository';

class TerritoryRepository implements ITerritoryRepository {
  private ormRepository: Repository<Territory>;

  constructor() {
    this.ormRepository = getRepository(Territory);
  }

  public async create({
    name,
    population,
    sect,
  }: ICreateTerritoryDTO): Promise<Territory> {
    const territory = this.ormRepository.create({
      name,
      population,
      sect,
    });

    await this.ormRepository.save(territory);

    let savedTerritory = await this.findById(territory.id);
    if (!savedTerritory) {
      savedTerritory = territory;
    }

    return savedTerritory;
  }

  public async update(territory: Territory): Promise<Territory> {
    await this.ormRepository.save(territory);

    let savedTerritory = await this.findById(territory.id);

    if (!savedTerritory) {
      savedTerritory = territory;
    }

    return savedTerritory;
  }

  public async findById(territory_id: string): Promise<Territory | undefined> {
    const territoryFound = await this.ormRepository.findOne({
      where: { id: territory_id },
    });

    // if not found, return undefined
    return territoryFound;
  }

  public async findByName(
    territory_name: string,
  ): Promise<Territory | undefined> {
    const territoryFound = await this.ormRepository.findOne({
      where: { name: territory_name },
    });

    // if not found, return undefined
    return territoryFound;
  }

  public async listAll(): Promise<Territory[]> {
    const territoryList = await this.ormRepository.find({
      order: { name: 'ASC' },
    });

    return territoryList;
  }

  public async delete(territory_id: string): Promise<void> {
    const territory = await this.ormRepository.findOne({
      where: { id: territory_id },
    });

    if (territory) {
      await this.ormRepository.remove(territory);
    }
  }
}

export default TerritoryRepository;
