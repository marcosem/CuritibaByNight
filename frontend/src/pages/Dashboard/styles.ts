import styled, { css } from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';

interface ICharacterProps {
  isMobile: boolean;
}

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main<ICharacterProps>`
  min-width: 340px;
  max-width: 1012px;
  margin: 18px auto;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
    `}
`;

export const TitleBox = styled.div`
  padding: 20px;
  margin: 10px auto;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  }
`;

export const Character = styled.ul<ICharacterProps>`
  min-width: 340px;
  max-width: 1012px;
  background: transparent;
  display: flex;
  flex-direction: row;

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
      flex-direction: column;
      align-items: center;
    `}
`;

export const Scroll = styled(PerfectScrollBar)`
  max-height: 600px;
  padding: 5px 20px;
  margin-top: 5px;
`;

/*
ul.cards{
  width: 660px; margin: 0 auto 20px;
  height: 300px;
  list-style-type: none;
  position: relative;
  padding: 20px 0;
  cursor: pointer;
  li.title{ margin: 0 0 20px;
    h2{ font-weight: 700; }
  }
  li.card{
    background: #FFF; overflow: hidden;
    height: 200px; width: 200px;
    border-radius: 10px;
    position: absolute; left: 0px;
    box-shadow: 1px 2px 2px 0 #aaa;
    transition: all 0.4s cubic-bezier(.63,.15,.03,1.12);
    img{
       max-width: 100%; height: auto;
    }
    div.content{
      padding: 5px 10px;
      h1{

      }
      p{

      }
    }

    &.card-1{
      z-index: 10; transform: rotateZ(-2deg);
    }
    &.card-2{
      z-index: 9; transform: rotateZ(-7deg);
      transition-delay: 0.05s;
    }
    &.card-3{
      z-index: 8; transform: rotateZ(5deg);
      transition-delay: 0.1s;
    }
  }

  &.transition{
    li.card{
      transform: rotateZ(0deg);
      &.card-1{
        left: 440px;
      }

      &.card-2{
        left: 220px;
      }

      &.card-3{
      }
    }
  }
}
*/
