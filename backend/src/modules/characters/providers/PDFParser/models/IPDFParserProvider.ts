import Character from '@modules/characters/infra/typeorm/entities/Character';
import CharacterTrait from '@modules/characters/infra/typeorm/entities/CharacterTrait';

export interface IPDFParseDTO {
  character: Character;
  charTraits: CharacterTrait[];
}

export default interface IPDFParserProvider {
  parse(filename: string): Promise<IPDFParseDTO | undefined>;
}
