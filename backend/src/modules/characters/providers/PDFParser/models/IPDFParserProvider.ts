import Character from '@modules/characters/infra/typeorm/entities/Character';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';
import LocationAvailableTrait from '@modules/locations/infra/typeorm/entities/LocationAvailableTrait';

export interface IPDFParseDTO {
  character: Character;
  charTraits: CharacterTrait[];
  locationAvailableTraits: LocationAvailableTrait[];
}

export default interface IPDFParserProvider {
  parse(
    filename: string,
    masqueradeLevel: number,
  ): Promise<IPDFParseDTO | undefined>;
}
