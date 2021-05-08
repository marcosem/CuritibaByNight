import React, { HtmlHTMLAttributes } from 'react';
import { Container, MapPin, ImgContainer, PinShadow, Pulsate } from './styles';

type MapMarkerProps = HtmlHTMLAttributes<HTMLDivElement> & {
  selected?: boolean;
  ownership?: string;
};

const Button: React.FC<MapMarkerProps> = ({
  children,
  selected = false,
  ownership = '',
  ...rest
}) => (
  <Container>
    <MapPin ownership={ownership} {...rest}>
      <ImgContainer>{children}</ImgContainer>
    </MapPin>
    <PinShadow>{selected && <Pulsate ownership={ownership} />}</PinShadow>
  </Container>
);

export default Button;
