import styled, { css, keyframes } from 'styled-components';
import { lighten, shade } from 'polished';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const openDialog = keyframes`
  from {
    transform: scale(0.2);
    opacity: 0.2;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const closeDialog = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }

  to {
    transform: scale(0.2);
    opacity: 0.2;
  }
`;

interface ITableType {
  empty?: boolean;
  isScrollOn?: boolean;
}

interface ITableCell {
  centered?: boolean;
  invalid?: boolean;
}

interface IModalProps {
  openClose: boolean;
}

interface IModalLabelProps {
  invalid?: boolean;
}

export const Container = styled.div`
  height: calc(100vh - 140px);
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

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: center;
  align-items: center;
`;

export const InputBox = styled.div`
  margin-right: 24px;
  max-width: 340px;
`;

export const InputFileBox = styled.div`
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  strong {
    font-size: 16px !important;
    margin: 0 5px 0 10px !important;
  }

  span {
    font-size: 16px !important;
    margin-left: 0 !important;
  }

  label {
    max-width: 340px;
    position: relative;
    background: #100909;
    padding: 16px;
    font-size: 16px;
    color: #eee;

    border-radius: 10px;
    margin: 10px 0;
    border: 0;
    width: 100%;

    transition: background-color 0.2s;

    &:hover {
      background: ${lighten(0.05, '#100909')};
      cursor: pointer;
    }

    svg {
      height: 20px;
      width: 20px;
      margin: auto 16px auto auto;
    }

    input {
      display: none;
    }
  }
`;

export const TableWrapper = styled.div`
  border-radius: 11px;
  padding-bottom: 16px;
  min-width: 340px;
  max-width: 900px;
  margin: 0 auto;

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
  min-width: 340px;
  max-width: 900px;

  font-size: 12px;

  background-color: transparent;
  opacity: 0.9;

  margin: 0 0 0 auto;

  td {
    padding: 4px;
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
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

    ${props =>
      props.empty
        ? css`
            border-radius: 10px;
          `
        : css`
            border-radius: 10px 10px 0 0;
          `}

    th {
      color: #fff;
      background: #560209;
      font-weight: 450;

      &:nth-child(odd) {
        color: #fff;
        background: #0d0d0d;
      }

      &:first-child {
        width: 30px;
      }

      &:last-child {
        width: 85px;
      }

      ${props =>
        props.empty
          ? css`
              &:first-child {
                border-radius: 10px 0 0 10px;
              }

              &:last-child {
                border-radius: 0 10px 10px 0;
              }
            `
          : css`
              &:first-child {
                border-radius: 10px 0 0 0;
              }

              &:last-child {
                border-radius: 0 10px 0 0;
              }
            `}
    }
  }

  tr {
    display: table;
    width: 100%;
    table-layout: fixed;
    height: 32px;

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
    max-height: 50vh;
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

    tr {
      display: table;
      width: 100%;
      table-layout: fixed;

      td {
        &:first-child {
          width: 30px;
        }

        &:last-child {
          ${props =>
            props.isScrollOn
              ? css`
                  width: 75px;
                `
              : css`
                  width: 85px;
                `}
        }
      }

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

export const TableCell = styled.div<ITableCell>`
  display: flex;
  overflow-wrap: break-word;
  word-wrap: break-word;

  ${props =>
    props.invalid
      ? css`
          color: #860209;
        `
      : css`
          color: #000;
        `}

  ${props =>
    props.centered
      ? css`
          justify-content: center;
        `
      : css`
          justify-content: left;
        `}

  svg {
    color: #049c10;
    width: 20px;
    height: 20px;
  }
`;

export const ButtonBox = styled.div`
  margin: 20px auto 0 auto;
  max-width: 340px;
`;

export const RemoveButton = styled.button`
  width: 24px;
  height: 24px;

  margin: auto;

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  border: 0;
  border-radius: 6px;
  background: #860209;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#860209')};
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

export const ModalOverlay = styled.div`
  background: transparent;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
`;

export const ModalContainer = styled.div<IModalProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  max-height: 400px;
  max-width: 400px;
  border-radius: 5px;
  position: relative;

  background: #eee;
  box-shadow: 4px 4px 64px rgba(0, 0, 0, 0.5);

  ${props =>
    props.openClose
      ? css`
          animation: ${openDialog} 0.2s ease-in-out 1;
        `
      : css`
          animation: ${closeDialog} 0.2s ease-in-out 1;
        `}
`;

export const CloseModalButton = styled.button`
  position: absolute;
  background: transparent;
  right: 0.3rem;
  top: 0.3rem;
  width: 1.6rem;
  height: 1.6rem;
  border: 0;
  font-size: 0px;
  cursor: pointer;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  transition: background-color 0.2s;

  svg {
    color: #000;
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    background-color: #bbb;
  }
`;

export const ModalLabelContainer = styled.div<IModalLabelProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 390px;

  height: 60px;
  margin: 10px;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  strong,
  span {
    max-width: 390px;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    font-size: 14px;

    ${props =>
      props.invalid
        ? css`
            color: #560209 !important;
          `
        : css`
            color: #e38627 !important;
          `}
  }
`;
