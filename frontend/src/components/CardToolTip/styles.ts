import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    width: 100px;
    background: #860209;
    text-align: center;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.4s;
    visibility: hidden;

    position: absolute;
    left: calc(100% + 57px);
    top: -5px;
    transform: translateX(-50%);

    color: #fff;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 97%;

      border-style: solid;
      border-color: #860209 transparent;
      margin-top: -2px;
      border-width: 6px 6px 0 6px;
      transform: rotate(90deg);
    }
  }

  &:hover span {
    opacity: 0.9;
    visibility: visible;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;
