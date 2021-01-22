import styled from 'styled-components';
// import PerfectScrollBar from 'react-perfect-scrollbar';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;
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
        width: 60px;
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
    max-height: 75vh;
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
        width: 60px;
        // border-radius: 10px 0 0 0;
      }

      &:last-child {
        width: 70px;
        // border-radius: 0 10px 0 0;
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

/*
export const Scroll = styled(PerfectScrollBar)`
  max-height: 82vh;
  padding: 5px 20px;
  margin-top: 5px;
`;
*/

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
