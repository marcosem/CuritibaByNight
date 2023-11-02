import styled, { css } from 'styled-components';
// import { shade, lighten } from 'polished';
/* import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core';
*/

interface IContainerProps {
  isMobile: boolean;
}

/*
interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
}

interface IActionBoxProps {
  disabled?: boolean;
}

interface IIconBoxProps {
  colorInterface?: string;
}

interface ITableTitleRowProps {
  borderTop?: boolean;
}
*/

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

/*
export const TableWrapper = styled.div`
  margin: 10px auto;
  min-width: 340px;
  max-width: 1012px;
`;

export const ActionHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 5px auto;

  min-width: 340px;
  max-width: 1012px;

  > h2 {
    color: var(--cbn-neutral-2);
    font-size: 24px;
    font-weight: 500;
  }
`;

export const ActionsInfo = styled.div`
  display: flex;
  flex-direction: space-between;
  margin: 0 auto;
  width: 100%;

  &:first-of-type {
    padding: 10px 0 0 0;
  }

  > h3 {
    color: var(--cbn-neutral-3);
    font-size: 16px;
    font-weight: 500;

    &:first-of-type {
      margin: 0 auto 0 0;
    }

    &:not(:first-of-type) {
      margin: 0 0 0 auto;
    }
  }

  > span {
    color: var(--cbn-neutral-3);
    font-size: 14px;
    font-weight: 400;
  }
`;

export const TableTitleRow = styled.div<ITableTitleRowProps>`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 5px auto;
  align-items: center;

  min-width: 340px;
  max-width: 1012px;

  ${props =>
    props.borderTop &&
    css`
      margin-top: 20px;
      border-top: 1px solid var(--cbn-neutral-2);
    `}

  > h2 {
    color: var(--cbn-neutral-2);
    font-size: 18px;
    font-weight: 500;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin: 20px 0 0 auto;

  div {
    max-width: 340px;
  }
`;

export const StyledTableContainer = styled(TableContainer)`
  && {
    max-height: 67vh;

    scrollbar-width: thin;
    scrollbar-color: #555;
    scrollbar-track-color: #f5f5f5;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 8px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #555;
    }

    border-radius: 10px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  }
`;

export const StyledTable = styled(Table)``;

export const StyledTableHead = styled(TableHead)``;

export const StyledTableBody = styled(TableBody)``;

export const StyledTableRow = styled(TableRow)`
  // Prioritize the CSS rules of styled-component over those of JSS
  && {
    ${StyledTableBody} & {
      &:nth-of-type(odd) {
        background-color: white;
      }

      &:nth-of-type(even) {
        background-color: #e8e7e7;
      }

      &:hover {
        background-color: #aaa;
        color: #fff;
      }

      &:last-of-type {
        td {
          &:first-of-type {
            border-radius: 0 0 0 10px;
          }

          &:last-of-type {
            border-radius: 0 0 10px 0;
          }
        }
      }
    }
  }
`;

export const StyledTableCell = styled(TableCell)`
  // Prioritize the CSS rules of styled-component over those of JSS
  && {
    ${StyledTableHead} & {
      font-family: 'Roboto', sans-serif;
      font-size: 12px;
      font-weight: 450;
      padding: 8px;
      text-align: center;
      line-height: 14px;
      color: #fff;

      &:first-of-type {
        border-radius: 10px 0 0 0;
      }

      &:last-of-type {
        border-radius: 0 10px 0 0;
      }

      &:nth-of-type(odd) {
        background: #0d0d0d;
      }

      &:nth-of-type(even) {
        background: #560209;
      }

      &:not(:last-of-type) {
        &:hover {
          cursor: pointer;
        }
      }
    }

    ${StyledTableBody} & {
      font-family: 'Roboto', sans-serif;
      font-size: 12px;
      font-weight: normal;
      padding: 8px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.87);

      &:not(:first-of-type) {
        border-left: 1px solid #ddd;
      }

      &:not(:last-of-type) {
        border-right: 1px solid #ddd;
      }

      &:last-of-type {
        width: 75px;
      }
    }
  }
`;

export const StyledTableSortLabel = styled(TableSortLabel)`
  // Prioritize the CSS rules of styled-component over those of JSS
  && {
    svg {
      color: #fff !important;
    }
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: space-between;
  justify-content: center;
  align-items: center;
`;

export const ActionButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))`
  width: 24px;
  height: 24px;

  margin: auto;

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 6px;
  transition: background-color 0.2s;

  background: #860209;
  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  svg {
    color: #fff;
    width: 12px;
    height: 12px;
  }

  ${props =>
    props.disabled &&
    css`
      cursor: default;
      opacity: 0.7;
    `}
`;

export const AddButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))`
  width: 24px;
  height: 24px;

  margin-right: 10px;
  // margin-right: auto;

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 6px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  transition: background-color 0.2s;

  ${props =>
    props.disabled
      ? css`
          background: #001a01;
          cursor: default;
        `
      : css`
          background: #028609;
          &:hover {
            background: ${shade(0.2, '#028609')};
          }
        `}

  svg {
    width: 20px;
    height: 20px;

    ${props =>
      props.disabled
        ? css`
            color: #7f7f7f;
          `
        : css`
            color: #fff;
          `}
  }
`;

export const AddActionBox = styled.div<IActionBoxProps>`
  display: flex;
  flex-direction: row;
  margin: 10px auto 0 0;

  ${props =>
    props.disabled
      ? css`
          cursor: default;
        `
      : css`
          cursor: pointer;
        `}

  span {
    font-size: 14px;
    font-weight: 500;
    margin: auto 0;

    ${props =>
      props.disabled
        ? css`
            color: #7f7f7f;
          `
        : css`
            color: var(--cbn-neutral-2);
            &:hover {
              color: ${lighten(0.2, '#e0e0e0')};
            }
          `}
  }
`;

export const IconBox = styled.div<IIconBoxProps>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > svg {
    margin: auto;
    width: 20px;
    height: 20px;

    ${props =>
      props.colorInterface === 'positive' &&
      css`
        color: #075202;
      `}

    ${props =>
      props.colorInterface === 'negative' &&
      css`
        color: #860209;
      `}

    ${props =>
      props.colorInterface === 'partial' &&
      css`
        color: #2196f3;
      `}

    ${props =>
      props.colorInterface === 'weak' &&
      css`
        color: #888;
      `}

    ${props =>
      (!props.colorInterface || props.colorInterface === 'neutral') &&
      css`
        color: #333;
      `}
  }
`;
*/
