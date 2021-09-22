import Territory from '@modules/locations/infra/typeorm/entities/Territory';
import ICreateTerritoryDTO from '@modules/locations/dtos/ICreateTerritoryDTO';
import ITerritoriesRepository from '@modules/locations/repositories/ITerritoriesRepository';

import { v4 } from 'uuid';

class FakeTerritoriesRepository implements ITerritoriesRepository {
  private territories: Territory[] = [];

  public async create({
    name,
    population,
    sect,
  }: ICreateTerritoryDTO): Promise<Territory> {
    const territory = new Territory();

    Object.assign(territory, {
      id: v4(),
      name,
      population,
      sect,
    });

    this.territories.push(territory);

    return territory;
  }

  public async update(territory: Territory): Promise<Territory> {
    this.territories = this.territories.map(oldTerritory =>
      oldTerritory.id !== territory.id ? oldTerritory : territory,
    );

    return territory;
  }

  public async findById(territory_id: string): Promise<Territory | undefined> {
    const findTerritory = this.territories.find(
      territory => territory.id === territory_id,
    );

    return findTerritory;
  }

  public async findByName(
    territory_name: string,
  ): Promise<Territory | undefined> {
    const findTerritory = this.territories.find(
      territory => territory.name === territory_name,
    );

    return findTerritory;
  }

  public async listAll(): Promise<Territory[]> {
    return this.territories;
  }

  public async delete(territory_id: string): Promise<void> {
    const listWithRemovedTerritory = this.territories.filter(
      territory => territory.id !== territory_id,
    );

    this.territories = listWithRemovedTerritory;
  }
}

export default FakeTerritoriesRepository;
