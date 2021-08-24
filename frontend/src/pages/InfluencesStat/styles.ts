import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ITableProps {
  detailedTable?: boolean;
}

interface IColumnProps {
  mySize?: string;
  highlight?: boolean;
  isScrollOn?: boolean;
}

interface ILegendProps {
  legendColor: string;
  selected: boolean;
}

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
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

export const InfluenceContainer = styled.div`
  min-width: 340px;
  max-width: 1012px;
  display: flex;
  margin: auto;
  flex-direction: row;
`;

export const InfluenceCardContainer = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }

  strong {
    margin-right: auto;
  }
`;

export const TableWrapper = styled.div<ITableProps>`
  margin: 10px auto;
  min-width: 320px;
  border-radius: 11px;
  padding-bottom: 16px;

  ${props =>
    props.detailedTable
      ? css`
          max-width: 900px;
        `
      : css`
          max-width: 700px;
        `}

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
`;

export const Table = styled.table<ITableProps>`
  border-radius: 10px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  min-width: 320px;

  ${props =>
    props.detailedTable
      ? css`
          max-width: 900px;
        `
      : css`
          max-width: 700px;
        `}

  font-size: 12px;
  background-color: transparent;
  opacity: 0.9;

  margin: 0 0 0 auto;

  thead {
    display: table;
    width: 100%;

    table-layout: fixed;
    border-radius: 10px 10px 0 0;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
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

export const TableColumnHeader = styled.th<IColumnProps>`
  text-align: center;
  padding: 8px;

  color: #fff;
  background: #560209;
  font-weight: 450;

  &:nth-child(odd) {
    color: #fff;
    background: #0d0d0d;
  }

  &:first-child {
    border-radius: 10px 0 0 0;
  }

  &:last-child {
    border-radius: 0 10px 0 0;
  }

  ${props =>
    !props.mySize &&
    css`
      &:first-child {
        width: 100px;
      }
    `}

  ${props =>
    props.mySize === 'short' &&
    css`
      width: 80px;
    `}

  ${props =>
    props.mySize === 'intermediate' &&
    css`
      width: 110px;
    `}
`;

export const TableColumn = styled.td<IColumnProps>`
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

  ${props =>
    !props.mySize &&
    css`
      &:first-child {
        width: 100px;
      }
    `}

  ${props =>
    props.mySize === 'short' &&
    css`
      ${props.isScrollOn
        ? css`
            width: 70px;
          `
        : css`
            width: 80px;
          `}
    `}

  ${props =>
    props.mySize === 'intermediate' &&
    css`
      ${props.isScrollOn
        ? css`
            width: 100px;
          `
        : css`
            width: 110px;
          `}
    `}
`;

export const TableCellHeader = styled.div<IColumnProps>`
  display: flex;
  flex-direction: row;
  color: #fff;

  span {
    font-size: 12px;
    font-weight: 500;
    margin: auto;
  }

  svg {
    width: 14px;
    height: 14px;
    margin-left: auto;

    ${props =>
      !props.highlight &&
      css`
        opacity: 0;
      `}
  }

  &:hover {
    cursor: pointer;
  }
`;

export const TableCell = styled.div<IColumnProps>`
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  word-wrap: break-word;

  ${props =>
    props.highlight
      ? css`
          color: #560209;

          span {
            font-weight: 500;
          }
        `
      : css`
          color: #000;

          span {
            font-weight: 400;
          }
        `}

  ${props =>
    props.mySize === 'short' || props.mySize === 'intermediate'
      ? css`
          text-align: center;

          span {
            font-size: 12px;
          }

          strong {
            font-size: 15px;
          }
        `
      : css`
          font-size: 12px;
          text-align: left;
        `}

  strong {
    font-weight: 500;
  }

  svg {
    color: #560209;
    width: 12px;
    height: 12px;
    margin-left: 3px !important;
  }

  span {
    &:not(:first-child) {
      margin-top: 3px;
      padding-top: 3px;
      border-top: 1px #ddd solid;
    }
  }
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

export const ReturnButton = styled.div`
  position: fixed;
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

export const ChartContainer = styled.div`
  width: 900px;
  display: flex;
  flex-direction: column;
  margin: 15px auto;

  h1 {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    text-align: center;
    border-top: 1px solid #888;
    padding-top: 5px;
  }
`;

export const PieChartContainer = styled.div`
  width: 900px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 15px auto;

  > svg {
    width: 374px;
    margin: auto;

    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */

    &:hover {
      cursor: pointer;
    }
  }
`;

export const ChartLegendContainer = styled.div`
  width: 435px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #888;
  padding: 5px;
  margin-left: auto;
  max-height: 374px;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  overflow-y: auto;

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

  h2 {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    text-align: left;
    // margin-left: 10px;
    padding: 0 0 10px 10px;
  }
`;

export const ChartLegend = styled.div<ILegendProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: background-color 0.2s;

  svg {
    padding: 0;
    width: 13px;
    height: 13px;

    ${props => css`
      color: ${props.legendColor};
    `}
  }

  span {
    font-size: 12px;
    font-weight: 400px;
    color: #fff;
    margin-left: 8px;
    padding: 1px 0;
  }

  ${props =>
    props.selected &&
    css`
      background-color: #444;
    `}

  &:hover {
    cursor: pointer;
    background-color: #555;
  }
`;
