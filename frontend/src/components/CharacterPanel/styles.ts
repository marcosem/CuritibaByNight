import styled, { keyframes, css } from 'styled-components';
import { shade, lighten } from 'polished';
import bgImg from '../../assets/yellow-old-paper.jpg';

interface ICharPanelProps {
  isMobile: boolean;
}

interface ITableCellProps {
  centered?: boolean;
}

const appearFromOpacity = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Content = styled.main<ICharPanelProps>`
  margin: 0 auto;
  background: url(${bgImg}) repeat;
  display: flex;
  overflow-y: auto;
  min-height: 382px;
  max-height: 75vh;

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

  border-radius: 4px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
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

export const CharCardContainer = styled.div<ICharPanelProps>`
  padding: 16px;

  ${props =>
    props.isMobile &&
    css`
      padding-bottom: 5px;

      div {
        margin: auto;
      }
    `}
`;

export const CharacterContainer = styled.div<ICharPanelProps>`
  display: flex;
  flex-direction: column;

  ${props =>
    props.isMobile
      ? css`
          width: 320px;
          margin: 10px;

          div {
            h1 {
              display: inline-block;
              height: 22px;
            }

            strong,
            span {
              display: inline-block;
              height: 17px;
            }
          }
        `
      : css`
          width: 100%;
          margin: 20px;
        `}

  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-bottom: 5px;

    h1 {
      color: #333;
    }

    strong {
      font-weight: 500;
      color: #333;

      &:not(:first-child) {
        ${props =>
          !props.isMobile &&
          css`
            margin-left: auto;
          `}
      }

      &:last-child {
        padding-top: 13px;
      }
    }

    span {
      font-size: 18px;
      font-weight: 400;
      color: #333;
      margin-left: 10px;
    }

    ${props =>
      props.isMobile
        ? css`
            h1 {
              font-size: 18px;
              font-weight: 550;
              margin: 0 auto;
            }

            strong {
              font-size: 14px;
            }

            span {
              font-size: 14px;
            }
          `
        : css`
            h1 {
              font-size: 24px;
              font-weight: 500;
              margin-bottom: 16px;

              &:not(:first-child) {
                margin-left: auto;
              }
            }

            strong {
              font-size: 18px;
            }

            span {
              font-size: 18px;
            }
          `}
  }
`;

export const TableWrapper = styled.div<ICharPanelProps>`
  margin: 10px auto;
  min-width: 320px;
  border-radius: 11px;
  padding-bottom: 16px;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  animation: ${appearFromOpacity} 0.6s;

  ${props =>
    props.isMobile
      ? css`
          max-width: 340px;
        `
      : css`
          max-width: 1012px;
        `}
`;

export const Table = styled.table<ICharPanelProps>`
  border-radius: 10px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  min-width: 320px;
  white-space: nowrap;
  background-color: transparent;
  opacity: 0.9;

  ${props =>
    props.isMobile
      ? css`
          font-size: 10px;
          max-width: 320px;
        `
      : css`
          font-size: 12px;
          max-width: 1012px;
        `}

  td {
    text-align: center;
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
        width: 50%;
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
    max-height: 36vh;
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
        width: 50%;
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

export const TableCell = styled.div<ITableCellProps>`
  display: flex;

  ${props =>
    props.centered &&
    css`
      justify-content: center;
    `}

  img {
    width: 30px;
    height: 30px;
    padding: 0 16px;
    border-radius: 50%;
    background: #888;

    border: 2px solid #860209;
  }
`;

export const ButtonBox = styled.div<ICharPanelProps>`
  margin: auto;
  padding: 16px 0;

  ${props =>
    props.isMobile
      ? css`
          max-width: 320px;
        `
      : css`
          max-width: 340px;
        `}
`;

export const PlayButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;

  width: 64px;
  height: 64px;
  border: 0;

  background: #025609;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.2s;

  svg {
    width: 32px;
    height: 32px;
    color: #ccc;
    transition: color 0.2s;
  }

  &:hover {
    background: ${lighten(0.2, '#025609')};
    svg {
      color: ${lighten(0.2, '#ccc')};
    }
  }
`;

export const RemoveButton = styled.button`
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

export const CharacterSheet = styled.div`
  padding: 10px 0 !important;
  margin: 0 !important;
  background: transparent;
  border: 0;
  display: flex;
  flex-direction: row;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  div {
    display: flex;
    margin-right: auto;

    a {
      text-decoration: none;
      display: flex;
      flex-direction: column;

      span {
        margin: 3px auto auto auto;
        font-size: 10px;
        color: #333;
      }

      svg {
        width: 32px;
        height: 32px;
        margin: 0 16px;
        color: #333;

        transition: color 0.3s;
      }

      &:hover {
        span {
          color: ${lighten(0.3, '#333')};
        }

        svg {
          color: ${lighten(0.3, '#333')};
        }
      }
    }
  }
`;
