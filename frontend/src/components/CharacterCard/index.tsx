import React, { lazy, Suspense } from 'react';
import Loading from '../Loading';

// import CharKindredCard from '../CharKindredCard';
// import CharRetainerCard from '../CharRetainerCard';
const CharKindredCard = lazy(() => import('../CharKindredCard'));
const CharRetainerCard = lazy(() => import('../CharRetainerCard'));

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
  regnant?: string;
  locked?: boolean;
  readOnly?: boolean;
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
  regnant = '',
  locked = false,
  readOnly = false,
}) => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        {clan.indexOf('Ghoul') >= 0 ||
        clan.indexOf('Retainer') >= 0 ||
        clan.indexOf('Wraith') >= 0 ||
        clan.indexOf('Curitiba By Night') >= 0 ? (
          <CharRetainerCard
            charId={charId}
            name={name}
            experience={experience}
            sheetFile={sheetFile}
            title={title}
            clan={clan}
            avatar={avatar}
            updatedAt={updatedAt}
            npc={npc}
            regnant={regnant}
            situation={situation}
            locked={locked}
            readOnly={readOnly}
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
            readOnly={readOnly}
          />
        )}
      </Suspense>
    </>
  );
};

export default CharacterCard;
