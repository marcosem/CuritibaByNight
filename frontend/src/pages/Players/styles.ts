import styled from 'styled-components';

/*
interface ITableProps {
  isST: boolean;
}
*/

export const Container = styled.div`
  height: 100vh;
`;

export const TableWrapper = styled.div`
  margin: 25px 70px 70px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
  max-width: 1120px;
  border-radius: 11px;
`;

export const Table = styled.table`
  border-radius: 10px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
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

    &:hover {
      cursor: pointer;
      background-color: #aaa;
      td {
        color: #fff;
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

// #0d0d0d #860209
// background: #4fc3a1;
// background: #324960;

/*
      ${props =>
        props.isST &&
        css`
          border: 3px solid #ffd700;
        `}
*/
