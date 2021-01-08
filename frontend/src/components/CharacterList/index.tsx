/* eslint-disable camelcase */
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { confirmAlert } from 'react-confirm-alert';
import CharacterCard from '../CharacterCard';
import { Scroll, Character } from './styles';
import { useMobile } from '../../hooks/mobile';
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
  const [savingCard, setSavingCard] = useState<boolean>(false);

  const { isMobileVersion } = useMobile();

  useEffect(() => {
    const splitNum = isMobileVersion ? 1 : 3;
    let tempArray: ICharacter[];

    const newArray: ICharacter[] = chars.map((char: ICharacter) => {
      let filteredClan2: string[];

      if (char.clan) {
        const filteredClan1 = char.clan.split(':');
        filteredClan2 = filteredClan1[0].split(' (');
      } else {
        filteredClan2 = [''];
      }

      const newChar = {
        id: char.id,
        name: char.name,
        experience: char.experience,
        updated_at: new Date(char.updated_at),
        character_url: char.character_url,
        clan: filteredClan2[0],
        title: char.title,
        coterie: char.coterie,
        avatar_url: char.avatar_url,
        situation: char.situation,
        npc: char.npc,
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

  const handleSaveCard = useCallback(async e => {
    setSavingCard(true);

    toPng(e.target).then(dataUrl => {
      confirmAlert({
        title: 'Cartão de Personagem',
        message: 'Deseja fazer o download do cartão do personagem?',
        buttons: [
          {
            label: 'Sim',
            onClick: () => {
              download(dataUrl, 'myCard.png');
            },
          },
          {
            label: 'Não',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick: () => {},
          },
        ],
      });
    });
    setSavingCard(false);
  }, []);

  return charList[0][0] === undefined ? (
    <></>
  ) : (
    <Scroll options={{ suppressScrollX: true }}>
      <Character isMobile={isMobileVersion}>
        <table>
          <tbody>
            {charList.map(row => (
              <tr key={`row:${row[0].id}`}>
                {row.map(char => (
                  <td key={char.id} onDoubleClick={handleSaveCard}>
                    <CharacterCard
                      charId={char.id}
                      name={char.name}
                      experience={char.experience}
                      sheetFile={char.character_url}
                      clan={char.clan}
                      title={char.title}
                      coterie={char.coterie}
                      avatar={char.avatar_url}
                      updatedAt={char.formatedDate ? char.formatedDate : ''}
                      npc={char.npc}
                      locked={locked}
                      saving={savingCard}
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
