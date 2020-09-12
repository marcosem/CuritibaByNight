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
  margin: 10px 70px 70px;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
  max-width: 1120px;
`;

export const Table = styled.table`
  border-radius: 4px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: white;

  td {
    text-align: center;
    padding: 8px;
    border-right: 1px solid #f8f8f8;
    font-size: 12px;
    color: #333;

    img {
      width: 32px;
      height: 32px;
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
    th {
      color: #ffffff;
      background: #4fc3a1;

      &:nth-child(odd) {
        color: #ffffff;
        background: #324960;
      }
    }
  }

  tr {
    &:nth-child(even) {
      background: #f8f8f8;
    }
  }
`;

/*
      ${props =>
        props.isST &&
        css`
          border: 3px solid #ffd700;
        `}
*/
