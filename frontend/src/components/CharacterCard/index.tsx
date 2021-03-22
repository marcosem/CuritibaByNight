/* eslint-disable camelcase */
import React, { lazy, Suspense } from 'react';
import Loading from '../Loading';

// import CharKindredCard from '../CharKindredCard';
// import CharAlliedCard from '../CharAlliedCard';
const CharKindredCard = lazy(() => import('../CharKindredCard'));
const CharAlliedCard = lazy(() => import('../CharAlliedCard'));

interface ICharacterCardProps {
  charId: string;
  name: string;
  experience: string;
  avatar: string;
  sheetFile: string;
  clan: string;
  creature_type: string;
  sect: string;
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
  creature_type,
  sect,
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
        {creature_type !== 'Vampire' ||
        clan.indexOf('Curitiba By Night') >= 0 ? (
          <CharAlliedCard
            charId={charId}
            name={name}
            experience={experience}
            sheetFile={sheetFile}
            title={title}
            clan={clan}
            creature_type={creature_type}
            sect={sect}
            avatar={avatar}
            coterie={coterie}
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
            creature_type={creature_type}
            sect={sect}
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
