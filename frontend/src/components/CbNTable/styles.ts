import styled, { css } from 'styled-components';
import { shade } from 'polished';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
} from '@material-ui/core';

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
}

interface ITableRowProps {
  $hasAction?: boolean;
}

interface ITableCellProps {
  $hasAction?: boolean;
  $bold?: boolean;
}

export const StyledTableContainer = styled(TableContainer)`
  && {
    max-height: 67vh;

    scrollbar-width: thin;
    scrollbar-color: var(--cbn-new-dark-3); // #474747
    scrollbar-track-color: var(--cbn-new-neutral-1); // #eee
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 8px;
      background-color: var(--cbn-new-neutral-1); // #eee
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      background-color: var(--cbn-new-neutral-1); // #eee
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: var(--cbn-new-dark-3); // #474747
    }

    border-radius: 10px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  }
`;

export const StyledTable = styled(Table)``;

export const StyledTableHead = styled(TableHead)``;

export const StyledTableBody = styled(TableBody)``;

export const StyledTableRow = styled(TableRow)<ITableRowProps>`
  // Prioritize the CSS rules of styled-component over those of JSS
  && {
    ${StyledTableBody} & {
      &:nth-of-type(odd) {
        background-color: var(--cbn-new-neutral-1); // #eee
      }

      &:nth-of-type(even) {
        background-color: var(--cbn-new-neutral-2); // #ddd
      }

      &:hover {
        background-color: var(--cbn-new-red-2); // #4f000f
        color: var(--cbn-new-neutral-1); // #eee

        td {
          color: var(--cbn-new-neutral-1); // #eee
        }
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

      ${props =>
        props.$hasAction &&
        css`
          cursor: pointer;
        `}
    }
  }
`;

export const StyledTableCell = styled(TableCell)<ITableCellProps>`
  // Prioritize the CSS rules of styled-component over those of JSS
  && {
    ${StyledTableHead} & {
      font-family: 'Roboto', sans-serif;
      font-size: 12px;
      font-weight: 450;
      padding: 8px;
      text-align: center;
      line-height: 14px;
      color: var(--cbn-new-neutral-1); // #eee

      &:first-of-type {
        border-radius: 10px 0 0 0;
      }

      &:last-of-type {
        border-radius: 0 10px 0 0;
      }

      &:nth-of-type(odd) {
        background: var(--cbn-new-dark-1); // #0a0a0a
      }

      &:nth-of-type(even) {
        background: var(--cbn-new-red-2); // #4f0007
      }

      ${props =>
        !props.$hasAction &&
        css`
          &:hover {
            cursor: pointer;
          }
        `}
    }

    ${StyledTableBody} & {
      font-family: 'Roboto', sans-serif;
      font-size: 12px;
      font-weight: ${props => (props.$bold ? 'bold' : 'normal')};
      padding: 8px;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.87);

      &:not(:first-of-type) {
        border-left: 1px solid var(--cbn-new-neutral-3); // #ddd
      }

      &:not(:last-of-type) {
        border-right: 1px solid var(--cbn-new-neutral-3); // #ddd
      }

      ${props =>
        props.$hasAction &&
        css`
          width: 75px;
        `}
    }
  }
`;

export const StyledTableSortLabel = styled(TableSortLabel)`
  // Prioritize the CSS rules of styled-component over those of JSS
  && {
    svg {
      color: var(--cbn-new-neutral-1) !important; // #eee
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
  width: 24px !important;
  height: 24px !important;

  margin: auto !important;

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 6px;
  transition: background-color 0.2s;

  background: var(--cbn-new-red-1) !important; // #870202
  &:hover {
    background: ${shade(0.2, '#870202')};
  }

  svg {
    color: var(--cbn-new-neutral-1) !important; // #eee
    width: 12px !important;
    height: 12px !important;
  }

  ${props =>
    props.disabled &&
    css`
      cursor: default;
      opacity: 0.7;
    `}
`;
