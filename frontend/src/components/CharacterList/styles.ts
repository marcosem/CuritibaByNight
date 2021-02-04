import styled, { css } from 'styled-components';

interface ICharacterProps {
  isMobile: boolean;
}

export const Character = styled.div<ICharacterProps>`
  min-width: 340px;
  max-width: 1012px;
  background: transparent;
  display: flex;
  flex-direction: row;

  table {
    width: 100%;
    min-width: 340px;
    max-width: 1012px;
    white-space: nowrap;
    border-collapse: separate;

    tbody {
      display: block;
      max-height: 74vh;
      overflow-y: auto;

      scrollbar-width: thin;
      scrollbar-color: #555;
      scrollbar-track-color: #333333; // #f5f5f5;
      scroll-behavior: smooth;

      &::-webkit-scrollbar {
        width: 8px;
        background-color: #333333; // #f5f5f5;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        background-color: #333333; // #f5f5f5;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 8px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #555;
      }
    }

    tr {
      display: table;
      width: 100%;
      table-layout: fixed;

      &:not(:last-child) {
        padding-bottom: 24px;
      }

      td {
        div {
          margin: 0 auto;
        }
      }
    }
  }

  ${props =>
    props.isMobile &&
    css`
      max-width: 340px;
      align-items: center;

      table {
        max-width: 340px;
      }
    `}
`;
