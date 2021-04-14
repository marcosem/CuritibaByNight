import styled, { css, keyframes } from 'styled-components';
import { shade } from 'polished';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface ITableCell {
  alignment: string;
  selected?: boolean;
}

interface ITableType {
  isSectTable?: boolean;
  isScrollOn?: boolean;
}

interface IActionButton {
  editMode?: boolean;
}

export const Container = styled.div`
  height: 100vh;
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

export const TablesContainer = styled.div`
  margin: 10px auto;
  display: flex;
  flex-direction: space-between;
  max-width: 1012px;
  justify-content: center;
`;

export const TableWrapper = styled.div<ITableType>`
  border-radius: 11px;
  padding-bottom: 16px;

  ${props =>
    props.isSectTable
      ? css`
          margin-left: 20px;
          width: 250px;
        `
      : css`
          margin-right: 20px;
          min-width: 340px;
          max-width: 535px;
        `}

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

export const Table = styled.table<ITableType>`
  border-radius: 10px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;

  ${props =>
    props.isSectTable
      ? css`
          width: 250px;
        `
      : css`
          min-width: 340px;
          max-width: 535px;
        `}

  font-size: 12px;
  background-color: transparent;
  opacity: 0.9;

  margin: 0 0 0 auto;

  td {
    padding: 8px;
    color: #000;

    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;

    &:first-child {
      border-left: 0;
    }

    &:last-child {
      border-right: 0;
    }
  }

  th {
    text-align: center;
    padding: 8px;
  }

  thead {
    display: table;
    width: 100%;

    table-layout: fixed;
    border-radius: 10px 10px 0 0;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

    th {
      color: #fff;
      background: #560209;
      font-weight: 450;

      &:nth-child(odd) {
        color: #fff;
        background: #0d0d0d;
      }

      width: 100px;

      &:first-child {
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        border-radius: 0 10px 0 0;
      }

      ${props =>
        props.isSectTable
          ? css`
              &:first-child {
                width: 150px;
              }
            `
          : css`
              &:first-child {
                width: 200px;
              }

              &:nth-child(3) {
                width: 150px;
              }

              &:last-child {
                width: 85px;
              }
            `}
    }
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
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
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

    td {
      width: 100px;

      ${props =>
        props.isSectTable
          ? css`
              &:first-child {
                width: 150px;
              }
            `
          : css`
              &:first-child {
                width: 200px;
              }

              &:nth-child(3) {
                width: 150px;
              }

              &:last-child {
                ${props.isScrollOn
                  ? css`
                      width: 75px;
                    `
                  : css`
                      width: 85px;
                    `}
              }
            `}
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

export const TableHeaderCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  span {
    width: calc(100% - 24px);
  }

  button {
    width: 24px;
    margin-left: 0;
  }
`;

export const TableCell = styled.div<ITableCell>`
  display: flex;
  overflow-wrap: break-word;
  word-wrap: break-word;

  ${props =>
    props.selected
      ? css`
          color: #860209;
        `
      : css`
          color: #000;
        `}

  ${props =>
    props.alignment === 'left' &&
    css`
      justify-content: left;
    `}

  ${props =>
    props.alignment === 'center' &&
    css`
      justify-content: center;
    `}

    ${props =>
    props.alignment === 'right' &&
    css`
      justify-content: flex-end;
    `}
`;

export const TableEditCell = styled.div<ITableCell>`
  display: flex;
  overflow-wrap: break-word;
  word-wrap: break-word;
  color: #000;

  ${props =>
    props.alignment === 'left' &&
    css`
      justify-content: left;
    `}

  ${props =>
    props.alignment === 'center' &&
    css`
      justify-content: center;
    `}

    ${props =>
    props.alignment === 'right' &&
    css`
      justify-content: flex-end;
    `}

  input {
    width: 100%;
    font-size: 12px;
    background: transparent;
    flex: 1;
    border: 0;
    color: #000;

    ${props =>
      props.alignment === 'left' &&
      css`
        text-align: left;
      `}

    ${props =>
      props.alignment === 'center' &&
      css`
        text-align: center;
      `}

    ${props =>
      props.alignment === 'right' &&
      css`
        text-align: right;
      `}

    &&::placeholder {
      color: #222;
    }
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  flex-direction: space-between;
  justify-content: center;
  align-items: center;
`;

export const ActionButton = styled.button<IActionButton>`
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

  ${props =>
    props.editMode
      ? css`
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
