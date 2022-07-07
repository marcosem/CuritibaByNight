import styled, { keyframes, css } from 'styled-components';
import { shade } from 'polished';
import bgImg from '../../assets/yellow-old-paper.jpg';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface IContainerProps {
  isMobile: boolean;
}

interface IDetailsContainerProps {
  borderTop?: boolean;
  borderLeft?: boolean;
  isMobile: boolean;
}

interface ITraitContainerProps {
  alignment?: string;
  isMobile: boolean;
}

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
}

interface IChangeTraitButtonProps {
  mode: string;
}

interface IAddonContainerProps {
  level: number;
  isMobile: boolean;
}

interface IAddonRequirementProps {
  justifyCenter?: boolean;
}

interface IActionButton {
  mode: string;
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

export const Container = styled.div<IContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          height: calc(100vh - 110px);
        `
      : css`
          height: calc(100vh - 140px);
        `}
`;

export const Content = styled.main<IContainerProps>`
  min-width: 340px;
  max-width: 1012px;
  margin: 0 auto;
  background: url(${bgImg}) repeat;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  ${props =>
    props.isMobile
      ? css`
          max-width: 340px;
          flex-direction: column;
        `
      : css`
          min-width: 340px;
          max-width: 1012px;

          flex-direction: row;
        `}
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
  height: 38px;
  position: relative;

  display: flex;
  flex-direction: space-between;
  padding: 10px;

  margin: 5px auto 10px auto;

  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

  > strong {
    color: #eee;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 500;
    margin: auto;
  }
`;

export const LocationCardContainer = styled.div<IContainerProps>`
  padding: 16px;
  display: flex;

  ${props =>
    props.isMobile &&
    css`
      justify-content: center;
    `}
`;

export const LocationDetailsContainer = styled.div<IContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  ${props =>
    props.isMobile
      ? css`
          margin: 10px;
          max-width: 320px;
        `
      : css`
          margin: 20px;
        `}

  div {
    display: flex;
    width: 100%;
    margin-bottom: 5px;

    h1 {
      font-size: 24px;
      font-weight: 500;
      color: #333;
    }

    strong {
      font-weight: 500;
      color: #333;
    }

    > span {
      font-weight: 400;
      color: #333;
    }

    ${props =>
      props.isMobile
        ? css`
            h1 {
              font-size: 16px;
              font-weight: 550;
              margin: 0 auto;
            }

            strong {
              font-size: 12px;
            }

            > span {
              font-size: 12px;
              margin-left: 5px;
            }
          `
        : css`
            h1 {
              font-size: 24px;
              font-weight: 500;
              margin-bottom: 16px;
            }

            strong {
              font-size: 18px;
            }

            > span {
              font-size: 18px;
              margin-left: 10px;
            }
          `}
  }
`;

export const SelectContainer = styled.div<IContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 29px;
  width: 100%;

  > strong {
    font-weight: 500;
    color: #333;
  }

  > div {
    display: flex;
    height: 24px;
    width: auto;
    flex-direction: row;
    align-content: center;
    justify-content: left;
  }

  ${props =>
    props.isMobile
      ? css`
          margin-top: 8px;
          flex-direction: column;
          margin-bottom: 16px !important;

          > strong {
            font-size: 10px !important;
            margin-bottom: 3px;
          }
        `
      : css`
          padding: 16px 0;
          flex-direction: row;

          > strong {
            font-size: 12px !important;
            margin-right: 10px;
          }
        `}

  label {
    width: auto;
    margin-left: 10px;
    justify-content: left;

    span {
      margin-left: 0;
      color: #333;
    }
  }
`;

export const Select = styled.select<IContainerProps>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  width: 160px;
  height: 22px;

  ${props =>
    props.isMobile
      ? css`
          margin-left: 0;
          margin-right: auto;
          font-size: 10px !important;
        `
      : css`
          font-size: 12px !important;
        `}

  background: #222;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-weight: 500;
  color: #ccc;
  text-align: left;
  text-align-last: center;
  -moz-text-align-last: center;
`;

export const GoBackButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))`
  position: fixed;
  bottom: 40px;
  right: 40px;

  width: 64px;
  height: 64px;
  border: 0;

  background: #860209;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  svg {
    width: 32px;
    height: 32px;
    color: #ccc;
  }
`;

export const AddButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))`
  width: 22px;
  height: 22px;

  margin-left: 10px;
  // margin-right: auto;

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 6px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: #028609;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#028609')};
  }

  svg {
    color: #fff;
    width: 12px;
    height: 12px;

    ${props =>
      props.disabled &&
      css`
        animation: ${rotate} 2s linear infinite;
      `}
  }
`;

export const LocationContainer = styled.div`
  display: flex;
  flex-direction: column;

  padding: 15px;
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

export const DetailsContainer = styled.div<IDetailsContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: transparent;
  padding: 0 0 15px 0;
  position: relative;

  ${props =>
    props.borderTop &&
    css`
      border-top: 1px solid #000;
      padding-top: 5px;
    `}

  ${props =>
    props.borderLeft &&
    css`
      border-left: 1px solid #000;
      padding-left: 5px;
      min-width: 50%;
    `}

  h1 {
    text-align: center;
    padding: 0 0 5px 0;
    margin: 0 !important;

    ${props =>
      props.isMobile
        ? css`
            font-size: 14px !important;
          `
        : css`
            font-size: 16px !important;
          `}
  }

  h2 {
    text-align: center;
    padding: 5px 0 5px 0 !important;
    margin: 0 !important;

    ${props =>
      props.isMobile
        ? css`
            font-size: 0.75rem !important;
          `
        : css`
            font-size: 0.875rem !important;
          `}
  }
`;

export const LocationShields = styled.div<IContainerProps>`
  display: flex;
  flex-direction: row;
  width: auto !important;
  margin: 0 !important;

  position: absolute;

  ${props =>
    props.isMobile
      ? css`
          top: 15px;
          right: 5px;
        `
      : css`
          top: 5px;
          right: 5px;
        `}
`;

export const LocationShield = styled.div<IContainerProps>`
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  padding: 1px;
  justify-content: center;
  align-items: center;
  cursor: default;
  border: 1px solid transparent;
  border-radius: 4px;

  transition: border-color 0.3s;

  svg {
    color: #000;
    transition: color 0.3s;
  }

  span {
    color: #000 !important;
    font-weight: 500 !important;
    margin: 0 !important;

    transition: color 0.3s;
  }

  ${props =>
    props.isMobile
      ? css`
          width: 21px !important;
          height: 31px !important;

          svg {
            width: 20px;
            height: 20px;
          }

          span {
            font-size: 10px !important;
          }
        `
      : css`
          width: 53px !important;
          height: 53px !important;

          svg {
            width: 38px;
            height: 38px;
          }

          span {
            font-size: 14px !important;
          }
        `}

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

export const DoubleDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const SingleTraitContainer = styled.div<ITraitContainerProps>`
  display: flex;
  flex-direction: row;
  padding: 1px 0 !important;
  margin: 0 !important;
  min-height: 18px !important;

  strong {
    margin: auto 5px auto 0 !important;
  }

  span {
    margin: auto 5px auto 0 !important;
  }

  ${props =>
    props.isMobile
      ? css`
          strong {
            font-size: 10px !important;
          }

          span {
            font-size: 10px !important;
          }
        `
      : css`
          strong {
            font-size: 12px !important;
          }

          span {
            font-size: 12px !important;
          }
        `}
`;

export const AddonContainer = styled.div<IAddonContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #efefef;

  ${props =>
    props.isMobile
      ? css`
          width: 288px !important;
        `
      : css`
          width: 310px !important;
        `}

  // margin: 0 !important;
  margin: 10px auto 0 auto !important;
  padding: 5px !important;

  border-radius: 4px;
  border: 2px solid;
  border-color: ${props => getLevelColor(props.level)};
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
`;

export const AddonDiv = styled.div`
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
`;

export const ActionContainer = styled.div`
  display: flex;
  margin: 5px 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: auto !important;
`;

export const ActionTitle = styled.h3<IContainerProps>`
  text-align: center;
  padding: 2px 0 2px 0 !important;
  margin: 0 !important;

  ${props =>
    props.isMobile
      ? css`
          font-size: 11px !important;
        `
      : css`
          font-size: 12px !important;
        `}
`;

export const ActionButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))<IActionButton>`
  width: 24px;
  height: 24px;

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

export const LevelBox = styled.div`
  display: flex;
  flex-direction: space-between;
  justify-content: center;
  align-items: center;
  height: 24px !important;
  margin: 0 5px !important;

  width: auto !important;
  border: 1px solid transparent;
  border-radius: 4px;

  span {
    font-size: 12px !important;
    font-weight: 500 !important;
    margin: 0 2px !important;
    color: #333 !important;
  }
`;

export const LevelTemp = styled.span`
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

export const SubDivision = styled.div`
  margin: 3px 0 !important;
  width: 90% !important;
  height: 1px;
  border: 1px solid #888;
  align-self: center;
`;

export const AddonRequirement = styled.div<IAddonRequirementProps>`
  display: flex;
  flex-direction: row;

  padding: 0 !important;
  margin: 3px 0 0 0 !important;
  width: 100%;

  ${props =>
    props.justifyCenter
      ? css`
          justify-content: center;
        `
      : css`
          justify-content: left;
        `}
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

export const ChangeTraitButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))<IChangeTraitButtonProps>`
  width: 16px;
  height: 16px;

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 4px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  transition: background-color 0.2s;

  ${props =>
    props.mode === 'up'
      ? css`
          margin-left: 5px;
          margin-right: 7px;
          background: #028609;

          &:hover {
            background: ${shade(0.2, '#028609')};
          }
        `
      : css`
          background: #860209;

          &:hover {
            background: ${shade(0.2, '#860209')};
          }
        `}

  svg {
    color: #fff;
    width: 12px;
    height: 12px;

    ${props =>
      props.disabled &&
      css`
        animation: ${rotate} 2s linear infinite;
      `}
  }
`;
