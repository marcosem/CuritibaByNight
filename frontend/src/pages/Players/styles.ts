import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface IContainerProps {
  isMobile: boolean;
}

interface ITableColumnProps {
  minWidth?: number;
}

interface IAvatarCellProps {
  isSt: boolean;
}

interface IConnectionProps {
  isConnected: boolean;
}

export const Container = styled.div<IContainerProps>`
  ${props =>
    props.isMobile
      ? css`
          min-height: calc(100vh - 110px);
        `
      : css`
          min-height: calc(100vh - 140px);
        `}
`;

export const TableWrapper = styled.div`
  margin: 10px auto;
  min-width: 340px;
  max-width: 1012px;
  border-radius: 11px;
`;

export const Table = styled.table`
  border-radius: 10px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  min-width: 340px;
  max-width: 1012px;
  white-space: nowrap;
  background-color: transparent;
  opacity: 0.9;

  thead {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-radius: 10px 10px 0 0;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }

  tr {
    display: table;
    width: 100%;
    table-layout: fixed;

    &:nth-child(even) {
      td {
        background: #e8e7e7;
      }
    }

    &:nth-child(odd) {
      td {
        background: white;
      }
    }

    &:last-child {
      td {
        &:first-child {
          border-radius: 0 0 0 10px;
        }

        &:last-child {
          border-radius: 0 0 10px 0;
        }
      }
    }
  }

  tbody {
    display: block;
    max-height: 75vh;
    overflow-y: auto;
    border-radius: 0 0 10px 10px;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

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

    tr {
      display: table;
      width: 100%;
      table-layout: fixed;

      &:hover {
        cursor: pointer;

        td {
          background-color: #aaa;
          color: #fff;
        }
      }
    }
  }
`;

export const TableColumn = styled.td<ITableColumnProps>`
  text-align: center;
  padding: 8px;
  font-size: 12px;
  color: #000;

  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;

  ${props =>
    props.minWidth
      ? css`
          width: ${props.minWidth}px;
        `
      : css`
          &:first-child {
            width: 60px;
          }

          &:last-child {
            width: 70px;
          }
        `}

  &:first-child {
    border-left: 0;
  }

  &:last-child {
    border-right: 0;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const TableColumnHeader = styled.th<ITableColumnProps>`
  text-align: center;
  padding: 8px;

  color: #fff;
  background: #560209;
  font-weight: 450;

  &:nth-child(odd) {
    color: #fff;
    background: #0d0d0d;
  }

  ${props =>
    props.minWidth
      ? css`
          width: ${props.minWidth}px;
        `
      : css`
          &:first-child {
            width: 60px;
          }

          &:last-child {
            width: 80px;
          }
        `}

  &:first-child {
    width: 60px;
    border-radius: 10px 0 0 0;
  }

  &:last-child {
    width: 80px;
    border-radius: 0 10px 0 0;
  }
`;

export const Avatar = styled.img<IAvatarCellProps>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #888;

  ${props =>
    props.isSt
      ? css`
          border: 2px solid #ffd700;
        `
      : css`
          border: 2px solid #860209;
        `}
`;

export const AvatarCell = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ConnectionStatus = styled.div<IConnectionProps>`
  display: flex;
  width: 8px;
  height: 8px;
  margin: 0 !important;
  padding: 0;
  border-radius: 50%;
  position: absolute;
  right: 6px;
  bottom: 2px;

  ${props =>
    props.isConnected
      ? css`
          background: #049c10;
        `
      : css`
          background: #860209;
        `}
`;

export const TableCell = styled.div`
  display: flex;
  align-items: left;

  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AddLink = styled.div`
  position: absolute;
  right: 40px;
  bottom: 40px;

  background: #860209;
  border-radius: 20px;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  a {
    width: 64px;
    height: 64px;

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: 32px;
      height: 32px;
      color: #ccc;
    }
  }
`;
