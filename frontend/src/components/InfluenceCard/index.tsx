/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import cardLocation from '../../assets/cards/card_location.png';
import getInfluenceImg from './getInfluenceImg';

import {
  Container,
  CardSquare,
  CardTitle,
  InfluenceImage,
  InfluenceInfo,
} from './styles';

import { useMobile } from '../../hooks/mobile';

interface IInfluenceCardProps {
  influence: string;
  key_ability: string;
}

const InfluenceCard: React.FC<IInfluenceCardProps> = ({
  influence,
  key_ability,
}) => {
  const [cardTitle, setCardTitle] = useState<string>('');
  const [influenceImage, setInfluenceImage] = useState<string>('');
  const { isMobileVersion } = useMobile();

  useEffect(() => {
    setCardTitle(`Influência em ${influence}`);
    setInfluenceImage(getInfluenceImg(influence));
  }, [influence]);

  return (
    <Container isMobile={isMobileVersion}>
      <CardSquare cardImg={cardLocation}>
        <CardTitle textLength={influence.length}>
          <span>{influence}</span>
        </CardTitle>

        <InfluenceImage>
          <img src={influenceImage} alt="" />
        </InfluenceImage>

        <InfluenceInfo>
          <strong>{cardTitle}</strong>
          <span>{`Habilidade Chave: ${key_ability}`}</span>
          <small>Curitiba By Night</small>
        </InfluenceInfo>
      </CardSquare>
    </Container>
  );
};

export default InfluenceCard;
