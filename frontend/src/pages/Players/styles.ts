import styled from 'styled-components';
import PerfectScrollBar from 'react-perfect-scrollbar';

export const Container = styled.div`
  height: 100vh;
`;

export const TableWrapper = styled.div`
  margin: 25px auto;
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
  background-color: white;
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
    th {
      color: #fff;
      background: #560209;

      &:nth-child(odd) {
        color: #fff;
        background: #0d0d0d;
      }

      &:first-child {
        width: 40px;
        border-radius: 10px 0 0 0;
      }

      &:last-child {
        width: 40px;
        border-radius: 0 10px 0 0;
      }
    }
  }

  tr {
    &:nth-child(even) {
      background: #e8e7e7;
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
    tr {
      &:hover {
        cursor: pointer;
        background-color: #aaa;

        td {
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

export const Scroll = styled(PerfectScrollBar)`
  max-height: 600px;
  padding: 5px 20px;
  margin-top: 5px;
`;
