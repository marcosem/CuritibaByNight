import Character from '@modules/characters/infra/typeorm/entities/Character';

export default interface IPDFParserProvider {
  parse(filename: string): Promise<Character | undefined>;
}
