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
  text-align: left !important;

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
