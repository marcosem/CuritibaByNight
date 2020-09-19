/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import CharacterCard from '../CharacterCard';
import { Scroll, Character } from './styles';
import { useMobile } from '../../hooks/mobile';
import Loading from '../Loading';
import ICharacter from './ICharacter';

interface ICharacterListProps {
  chars: ICharacter[];
  locked?: boolean;
  filterClan?: string;
  filterSituation?: string;
}

const CharacterList: React.FC<ICharacterListProps> = ({
  chars,
  locked = false,
  filterClan = '',
  filterSituation = 'active',
}) => {
  const [charList, setCharList] = useState<[ICharacter[]]>([[]]);

  const { isMobileVersion } = useMobile();

  useEffect(() => {
    const splitNum = isMobileVersion ? 1 : 3;
    let tempArray: ICharacter[];

    const newArray: ICharacter[] = chars.map((char: ICharacter) => {
      const filteredClan = char.clan.split(':');

      const newChar = {
        id: char.id,
        name: char.name,
        experience: char.experience,
        updated_at: new Date(char.updated_at),
        character_url: char.character_url,
        clan: filteredClan[0],
        avatar_url: char.avatar_url,
        situation: char.situation,
        formatedDate: format(new Date(char.updated_at), 'dd/MM/yyyy'),
        user: char.user,
      };
      return newChar;
    });

    tempArray = newArray;

    if (filterClan !== '') {
      tempArray = tempArray.filter((char: ICharacter) => {
        return char.clan === filterClan;
      });
    }

    if (filterSituation !== '') {
      tempArray = tempArray.filter((char: ICharacter) => {
        return filterSituation !== '' && char.situation === filterSituation;
      });
    }

    const rowArray: [ICharacter[]] = [tempArray.splice(0, splitNum)];
    while (tempArray.length > 0) {
      rowArray.push(tempArray.splice(0, splitNum));
    }

    setCharList(rowArray);
  }, [chars, isMobileVersion, filterClan, filterSituation]);

  return charList[0][0] === undefined ? (
    <Loading />
  ) : (
    <Scroll>
      <Character isMobile={isMobileVersion}>
        <table>
          <tbody>
            {charList.map(row => (
              <tr key={`row:${row[0].id}`}>
                {row.map(char => (
                  <td key={char.id}>
                    <CharacterCard
                      charId={char.id}
                      name={char.name}
                      experience={char.experience}
                      sheetFile={char.character_url}
                      clan={char.clan}
                      avatar={char.avatar_url}
                      updatedAt={char.formatedDate ? char.formatedDate : ''}
                      locked={locked}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Character>
    </Scroll>
  );
};

export default CharacterList;