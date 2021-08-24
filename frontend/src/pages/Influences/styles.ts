import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface IContainerProps {
  isMobile: boolean;
}

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
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

export const InfluenceContainer = styled.div<IContainerProps>`
  min-width: 340px;
  max-width: 1012px;
  display: flex;
  margin: auto;

  ${props =>
    props.isMobile
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
        `}
`;

export const InfluenceCardContainer = styled.div<IContainerProps>`
  display: flex;
  flex-direction: column;

  strong {
    padding-bottom: 10px;
    //padding: 0 0 10px 0;
    font-size: 16px;
    font-weight: 500;
  }

  ${props =>
    props.isMobile
      ? css`
          padding-bottom: 16px;
          > div {
            margin: auto;
          }

          strong {
            margin: auto;
          }
        `
      : css`
          strong {
            margin-right: auto;
          }
        `}
`;

export const TableWrapper = styled.div`
  margin: 10px auto;
  min-width: 320px;
  max-width: 700px;
  border-radius: 11px;
  padding-bottom: 16px;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

export const Table = styled.table`
  border-radius: 10px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  min-width: 320px;
  max-width: 700px;

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

      &:first-child {
        width: 100px;
        border-radius: 10px 0 0 0;
      }

      &:last-child {
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
    max-height: 70vh;
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
        width: 100px;
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
  justify-content: left;

  overflow-wrap: break-word;
  word-wrap: break-word;
  //hyphens: auto;
  color: #000;
`;

export const TableLevelsWrapper = styled.div`
  margin: 0 auto;
  min-width: 320px;
  max-width: 755px;

  border-radius: 11px;
  padding: 0 0 16px 16px;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  > div {
    display: flex;
    padding: 0 0 10px 0;

    strong {
      font-size: 16px;
      font-weight: 500;
      margin-left: auto;
    }
  }

  span {
    padding-top: 5px;
    width: 100%;
    font-size: 12px;
    display: flex;
    justify-content: center;
  }
`;

export const TableLevels = styled.table`
  border-radius: 10px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  min-width: 320px;
  background-color: transparent;
  opacity: 0.9;
  font-size: 12px;

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

      &:first-child {
        width: 50px;
        border-radius: 10px 0 0 0;
      }

      &:last-child {
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
      &:first-child {
        width: 50px;
      }
    }

    tr {
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

export const TableLevelsCell = styled.div`
  display: flex;
  overflow-wrap: break-word;
  word-wrap: break-word;
  // hyphens: auto;
  color: #000;

  strong {
    font-size: 16px;
    width: 100%;
    margin: auto;
    font-weight: bold;
    text-align: center;
  }

  span {
    font-size: 12px;
  }

  svg {
    padding-left: 5px;
    width: 20px;
    height: 20px;
    margin: auto;
    color: #000;

    visibility: hidden;
  }

  &:hover {
    svg {
      visibility: visible;
    }
  }
`;

export const GoBackButton = styled.button.attrs<IButtonProps>(() => ({
  type: 'button',
}))`
  position: fixed;
  bottom: 40px;
  right: 40px;

  width: 64px;
  height: 64px;
  border: 0;

  background: #860209;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  svg {
    width: 32px;
    height: 32px;
    color: #ccc;
  }
`;

export const StatisticsLink = styled.div`
  position: fixed;
  right: 40px;
  bottom: 40px;

  background: #090266;
  border-radius: 20px;

  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#090266')};
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
