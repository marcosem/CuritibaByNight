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

interface ILocationPanelProps {
  isMobile: boolean;
}

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main<ILocationPanelProps>`
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
    margin: auto 0;
  }
`;

export const LocationCardContainer = styled.div<ILocationPanelProps>`
  padding: 16px;
  display: flex;

  ${props =>
    props.isMobile &&
    css`
      justify-content: center;
    `}
`;

export const LocationCharsContainer = styled.div<ILocationPanelProps>`
  display: flex;
  flex-direction: column;
  width: 100%;

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

    span {
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

            span {
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

            span {
              font-size: 18px;
              margin-left: 10px;
            }
          `}
  }
`;

export const SelectContainer = styled.div<ILocationPanelProps>`
  display: flex;
  align-items: center;

  // height: 24px;
  width: 100%;

  strong {
    font-weight: 500;
    color: #333;
  }

  ${props =>
    props.isMobile
      ? css`
          margin-top: 8px;
          flex-direction: column;
          strong {
            font-size: 12px;
            margin-bottom: 3px;
          }
        `
      : css`
          padding: 16px 0;
          flex-direction: row;
          strong {
            font-size: 18px;
            margin-right: 10px;
          }
        `}
`;

export const Select = styled.select<ILocationPanelProps>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  width: 250px;

  ${props =>
    props.isMobile
      ? css`
          height: 17px;
          font-size: 13px;
        `
      : css`
          height: 22px;
          font-size: 14px;
        `}

  background: #222;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-weight: 500;
  color: #ccc;
  text-align: center;
  text-align-last: center;
  -moz-text-align-last: center;
`;

export const AddButton = styled.button`
  width: 24px;
  height: 24px;

  margin-left: 10px;

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
    width: 20px;
    height: 20px;

    ${props =>
      props.disabled &&
      css`
        animation: ${rotate} 2s linear infinite;
      `}
  }
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

export const ButtonBox = styled.div`
  margin: auto auto 0 auto;
  max-width: 340px;
  padding-top: 16px;
`;

export const SelectLocation = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  width: 250px;
  margin-left: auto;

  background: #111;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
`;

export const TableWrapper = styled.div`
  margin: 10px auto;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  min-width: 320px;
  max-width: 1012px;
  border-radius: 11px;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

export const Table = styled.table`
  border-radius: 10px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  min-width: 320px;
  max-width: 1012px;
  white-space: nowrap;
  background-color: transparent;
  opacity: 0.9;

  td {
    text-align: center;
    padding: 8px;
    font-size: 12px;
    color: #000;

    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;

    &:first-child {
      border-left: 0;
    }

    &:last-child {
      border-right: 0;
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #888;

      border: 2px solid #860209;
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

      &:first-child {
        width: 65%;
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        width: 80px;
        border-radius: 0 10px 0 0;
      }
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
    max-height: 40vh;
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

    td {
      &:first-child {
        width: 65%;
      }

      &:last-child {
        width: 75px;
      }
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

export const TableCell = styled.div`
  display: flex;
  align-items: left;

  img {
    width: 30px;
    height: 30px;
    padding: 0 16px;
    border-radius: 50%;
    background: #888;

    border: 2px solid #860209;
  }
`;
