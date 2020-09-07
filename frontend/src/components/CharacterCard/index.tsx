import React, { useEffect, useState } from 'react';
// import React, { useCallback, MouseEvent } from 'react';
// import html2canvas from 'html2canvas';

import {
  Container,
  CardSquare,
  ProfileImage,
  CharInfo,
  CharXPTitle,
  CharXP,
} from './styles';
import tempProfileImg from '../../assets/sign-up-background.png';

interface ICharacterCardProps {
  name: string;
  experience: string;
  avatar?: string;
  sheetFile: string;
  updatedAt?: string;
  isMobile: boolean;
}

const CharacterCard: React.FC<ICharacterCardProps> = ({
  name,
  experience,
  avatar,
  sheetFile,
  updatedAt,
  isMobile,
}) => {
  const [charImg, setCharImg] = useState<string>('');

  useEffect(() => {
    setCharImg(avatar || tempProfileImg);
  }, [avatar]);

  /*
  const saveCard = useCallback((e: MouseEvent<HTMLDivElement>) => {
    html2canvas(e.currentTarget).then(canvas => {
      const data = canvas.toDataURL('image/jpeg', 1);
      window.open(data, '_blank');
    });
  }, []);
*/

  return (
    <Container isMobile={isMobile}>
      <CardSquare>
        <span>{updatedAt}</span>
        <ProfileImage>
          <img src={charImg} alt="Profile" />
        </ProfileImage>
        <CharInfo>
          <a href={sheetFile} target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        </CharInfo>
        <CharXPTitle>
          <span>XP:</span>
        </CharXPTitle>
        <CharXP>
          <span>{experience}</span>
        </CharXP>
      </CardSquare>
    </Container>
  );
};

export default CharacterCard;
