import React, { useCallback } from 'react';
import { FaFacebook, FaInstagram, FaDiscord, FaSpotify } from 'react-icons/fa';
import {
  FooterBox,
  FooterWrapper,
  Bubbles,
  Bubble,
  FooterContent,
  InfoBox,
  CbNPages,
} from './styles';

const Footer: React.FC = () => {
  const NUM_BUBBLES = 128;

  const getBubbles = useCallback(() => {
    const bubblesArray = [];

    for (let i = 0; i < NUM_BUBBLES; i += 1) {
      const newStyle = {
        '--bubble-size': `${2 + Math.random() * 4}rem`,
        '--bubble-distance': `${6 + Math.random() * 4}rem`,
        '--bubble-position': `${-5 + Math.random() * 110}rem`,
        '--bubble-time': `${2 + Math.random() * 2}s`,
        '--bubble-delay': `${-1 * (2 + Math.random() * 2)}s`,
      } as React.CSSProperties;

      bubblesArray.push(<Bubble style={newStyle} />);
    }

    return bubblesArray;
  }, []);

  return (
    <FooterBox>
      <FooterWrapper>
        <Bubbles>{getBubbles()}</Bubbles>
        <FooterContent>
          <InfoBox align="left">
            <strong>Curitiba By Night</strong>

            <a href="mailto:owbn.curitiba@gmail.com">
              <strong>Contato - </strong>
              <span>owbn.curitiba@gmail.com</span>
            </a>
          </InfoBox>
          <CbNPages>
            <a
              href="https://www.facebook.com/groups/283920641632885/"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://discord.gg/fzfmJ2V"
              target="_blank"
              rel="noopener noreferrer"
              title="Discord"
            >
              <FaDiscord />
            </a>
            <a
              href="https://www.instagram.com/curitibabynight/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://open.spotify.com/playlist/0oaY20yvD69OtJ3rEftmGM?si=2HX7f7dOS7mhXpY3e8fHmg"
              target="_blank"
              rel="noopener noreferrer"
              title="Spotify"
            >
              <FaSpotify />
            </a>
          </CbNPages>
          <InfoBox align="right">
            <span>Desenvolvido por Marcos Mathias</span>

            <a href="mailto:marcos@memathias.com">
              <strong>Contato - </strong>
              <span>marcos@memathias.com</span>
            </a>

            <a
              href="https://github.com/marcosem/CuritibaByNight"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Repositório</span>
            </a>

            <a
              href="https://github.com/marcosem/CuritibaByNight/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Reportar um bug</span>
            </a>
          </InfoBox>
        </FooterContent>
        <svg style={{ position: 'fixed', top: '100vh' }}>
          <defs>
            <filter id="blob" style={{ position: 'fixed', top: '100vh' }}>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={10}
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="blob"
              />
            </filter>
          </defs>
        </svg>
      </FooterWrapper>
    </FooterBox>
  );
};

export default Footer;
