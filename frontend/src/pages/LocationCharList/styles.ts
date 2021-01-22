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

export const Container = styled.div`
  height: 100vh;
`;

export const Content = styled.main`
  min-width: 340px;
  max-width: 1012px;
  margin: 0 auto;
  background: url(${bgImg}) repeat;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
`;

export const TitleBox = styled.div`
  min-width: 340px;
  max-width: 1012px;
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

export const LocationCardContainer = styled.div`
  padding: 16px;
`;

export const LocationCharsContainer = styled.div`
  width: 100%;
  margin: 20px;

  display: flex;
  flex-direction: column;

  div {
    display: flex;
    width: 100%;
    margin-bottom: 5px;

    h1 {
      font-size: 24px;
      font-weight: 500;
      color: #333;
      margin-bottom: 16px;
    }

    strong {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    span {
      font-size: 18px;
      font-weight: 400;
      color: #333;
      margin-left: 10px;
    }
  }
`;

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px 0;
  align-items: center;

  height: 24px;
  width: 100%;

  strong {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-right: 10px;
  }
`;

export const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  height: 22px;
  width: 250px;

  background: #222;
  border-radius: 4px;
  border: 0;
  padding: 0 8px;
  font-size: 14px;
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
    width: 20px;
    height: 20px;

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

    svg {
      width: 12px;
      height: 12px;
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
        width: 70%;
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
      width: 12px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #555;
    }

    td {
      &:first-child {
        width: 70%;
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
