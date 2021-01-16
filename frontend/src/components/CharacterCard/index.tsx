import React from 'react';

import CharKindredCard from '../CharKindredCard';
import CharRetainerCard from '../CharRetainerCard';

interface ICharacterCardProps {
  charId: string;
  name: string;
  experience: string;
  avatar: string;
  sheetFile: string;
  clan: string;
  title: string;
  coterie: string;
  updatedAt: string;
  situation?: string;
  npc?: boolean;
  locked?: boolean;
}

const CharacterCard: React.FC<ICharacterCardProps> = ({
  charId,
  name,
  experience,
  avatar,
  sheetFile,
  clan,
  title,
  coterie,
  updatedAt,
  situation = 'active',
  npc = false,
  locked = false,
}) => {
  return (
    <>
      {clan.indexOf('Ghoul') >= 0 || clan.indexOf('Retainer') >= 0 ? (
        <CharRetainerCard
          charId={charId}
          name={name}
          experience={experience}
          sheetFile={sheetFile}
          title={title}
          coterie={coterie}
          avatar={avatar}
          updatedAt={updatedAt}
          npc={npc}
          situation={situation}
          locked={locked}
        />
      ) : (
        <CharKindredCard
          charId={charId}
          name={name}
          experience={experience}
          sheetFile={sheetFile}
          clan={clan}
          title={title}
          coterie={coterie}
          avatar={avatar}
          updatedAt={updatedAt}
          situation={situation}
          npc={npc}
          locked={locked}
        />
      )}
    </>
  );
};

export default CharacterCard;
