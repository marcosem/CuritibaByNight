import React, { HtmlHTMLAttributes } from 'react';
// import { FaSpinner } from 'react-icons/fa';
import { Container, MapPin, ImgContainer, PinShadow, Pulsate } from './styles';
import imgBuilding from '../../assets/building.jpg';

type MapMarkerProps = HtmlHTMLAttributes<HTMLDivElement> & {
  image?: string;
  selected?: boolean;
  isOwner?: boolean;
};

const Button: React.FC<MapMarkerProps> = ({
  image,
  selected = false,
  isOwner = false,
  ...rest
}) => (
  <Container>
    <MapPin isOwner={isOwner} {...rest}>
      <ImgContainer>
        <img src={image || imgBuilding} alt="" />
      </ImgContainer>
    </MapPin>
    <PinShadow>{selected && <Pulsate isOwner={isOwner} />}</PinShadow>
  </Container>
);

export default Button;
