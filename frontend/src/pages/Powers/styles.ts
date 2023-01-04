import styled, { css } from 'styled-components';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';

interface IContainerProps {
  isMobile: boolean;
}

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

export const TableWrapper = styled.div`
  margin: 10px auto;
  min-width: 340px;
  max-width: 1012px;
  // border-radius: 11px;
`;

export const StyledTable = styled(Table)``;

export const StyledTableHead = styled(TableHead)``;

export const StyledTableBody = styled(TableBody)``;

export const StyledTableRow = styled(TableRow)`
  ${StyledTableHead} & {
  }

  ${StyledTableBody} & {
    &:nth-of-type(odd) {
      background-color: white;
    }

    &:nth-of-type(even) {
      background-color: #e8e7e7;
    }

    &:hover {
      cursor: pointer;
      background-color: #aaa;
      color: #fff;
    }

    &:last-of-type {
      td {
        &:first-of-type {
          border-radius: 0 0 10px 0;
        }

        &:last-of-type {
          border-radius: 0 0 0 10px;
        }
      }
    }
  }
`;

export const StyledTableCell = styled(TableCell)`
  ${StyledTableHead} & {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 450;
    padding: 8px;
    text-align: center;
    line-height: 14px;

    &:first-of-type {
      border-radius: 10px 0 0 0;
    }

    &:last-of-type {
      border-radius: 0 10px 0 0;
    }

    &:nth-of-type(odd) {
      color: #fff;
      background: #0d0d0d;
    }

    &:nth-of-type(even) {
      color: #fff;
      background: #560209;
    }
  }

  ${StyledTableBody} & {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: normal;
    padding: 8px;
    line-height: 14px;

    &:not(:first-of-type) {
      border-left: 1px solid #ddd;
    }

    &:not(:last-of-type) {
      border-right: 1px solid #ddd;
    }
  }
`;
