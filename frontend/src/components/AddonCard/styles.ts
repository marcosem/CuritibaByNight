import styled from 'styled-components';
import { lighten } from 'polished';

interface ITitleProps {
  level: number;
}

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
}

const getLevelColor = (level: number): string => {
  switch (level) {
    case 2:
      return '#075202';
    case 3:
    case 4:
      return '#032fc9';
    case 5:
      return '#5d0798';
    case 6:
    case 7:
      return '#ff5733';
    default:
      return '#707b7c';
  }
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #efefef;
  width: 295px !important;
  padding: 0px;
  margin: auto !important;
  position: relative;
`;

export const AddonTitle = styled.h1<ITitleProps>`
  font-size: 14px !important;
  font-weight: 550 !important;
  margin: 0 !important;
  transition: color 0.3s;

  color: ${props => getLevelColor(props.level)} !important;

  &:hover {
    color: ${props => lighten(0.3, `${getLevelColor(props.level)}`)} !important;
  }
`;

export const AddonLevel = styled.h3<ITitleProps>`
  font-size: 11px !important;
  font-weight: 500 !important;
  margin: 0 !important;
  color: ${props => getLevelColor(props.level)} !important;
`;

export const AddonDescription = styled.span`
  font-size: 12px !important;
  font-weight: 500 !important;
  margin: 0 !important;
  color: #000;
`;

export const Division = styled.div`
  margin: 5px 0 !important;
  width: 100% !important;
  height: 1px;
  border: 1px solid #000;
`;

export const SubDivision = styled.div`
  margin: 3px 0 !important;
  width: 90% !important;
  height: 1px;
  border: 1px solid #888;
  align-self: center;
`;

export const AddonShields = styled.div`
  display: flex;
  flex-direction: row;
  width: auto !important;
  margin: 0 !important;

  position: absolute;
  top: 5px;
  right: 5px;
`;

export const AddonShield = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 1px;
  width: 28px !important;
  height: 28px !important;
  justify-content: center;
  align-items: center;
  cursor: default;
  border: 1px solid transparent;
  border-radius: 4px;

  transition: border-color 0.3s;

  svg {
    color: #000;
    width: 12px;
    height: 12px;

    transition: color 0.3s;
  }

  span {
    color: #000 !important;
    font-size: 10px !important;
    font-weight: 400 !important;
    margin: 0 !important;

    transition: color 0.3s;
  }

  &:hover {
    border-color: #888;

    svg {
      color: #888;
    }

    span {
      color: #888 !important;
    }
  }
`;

export const AddonSubtitle = styled.h2`
  font-size: 11px !important;
  font-weight: 500 !important;
  margin: 0 !important;
  color: #000;
  text-align: center;
`;

export const AddonLabel = styled.h3`
  font-size: 11px !important;
  font-weight: 500 !important;
  margin: 0 !important;
  color: #333 !important;
  text-align: center;
`;

export const AddonRequirement = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 !important;
  margin: 3px 0 0 0 !important;
  width: 100%;
`;

export const AddonReqTitle = styled.span`
  font-size: 10px !important;
  font-weight: 500 !important;
  margin: 0 !important;
  color: #000 !important; ;
`;

export const AddonReqDesc = styled.span`
  font-size: 10px !important;
  font-weight: 500 !important;
  margin: 0 0 0 3px !important;
  color: #707b7c !important; ;
`;

/*
export const KeyReqContainer = styled.div`
  display: flex;
  margin: 5px 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: auto !important;
`;

export const KeyReqText = styled.div<IKeyReqTextProps>`
  display: flex;
  flex-direction: space-between;
  justify-content: center;
  align-items: center;
  height: 24px !important;
  margin: 0 5px !important;

  border-radius: 4px;

  ${props =>
    props.showBorder
      ? css`
          width: 54px !important;
          border: 1px solid #888;
        `
      : css`
          width: auto !important;
          border: 1px solid transparent;
        `}

  span {
    font-size: 12px !important;
    font-weight: 500 !important;
    margin: 0 2px !important;
    color: #333 !important;
  }
`;

export const KeyReqTemp = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 12px !important;
  font-weight: 500 !important;
  margin: 0 !important;
  color: #000 !important;

  width: 24px !important;
  height: 24px !important;

  border: 1px solid #888;
  border-radius: 4px;
`;

export const ActionButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))<IActionButton>`
  width: 24px;
  height: 24px;

  // margin: auto;

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 6px;
  transition: background-color 0.2s;

  ${props =>
    props.mode === 'up'
      ? css`
          background: #028609;
        `
      : css`
          background: #860209;
        `}

  ${props =>
    props.mode === 'up' &&
    !props.disabled &&
    css`
      &:hover {
        background: ${shade(0.2, '#028609')};
      }
    `}

    ${props =>
    props.mode === 'down' &&
    !props.disabled &&
    css`
      &:hover {
        background: ${shade(0.2, '#860209')};
      }
    `}

  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: default;
    `}

  svg {
    color: #fff;
    width: 12px;
    height: 12px;
  }
`;
*/
export const DetailsButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))<ITitleProps>`
  display: flex;
  align-items: center;
  justify-content: left;
  background: transparent;
  border: none;

  svg {
    color: ${props => getLevelColor(props.level)} !important;
    width: 14px;
    height: 14px;
    transition: color 0.3s;
  }

  &:hover {
    svg {
      color: ${props =>
        lighten(0.3, `${getLevelColor(props.level)}`)} !important;
    }
  }
`;
