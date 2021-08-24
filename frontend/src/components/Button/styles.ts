import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface IButtonProps {
  readonly type: 'button' | 'submit' | 'reset' | undefined;
}

export const Container = styled.button.attrs<IButtonProps>(
  (props: IButtonProps) => ({
    type: props.type || 'button',
  }),
)`
  background: #860209;
  color: #d5d5d5;
  font-weight: 500;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  transition: background-color 0.2s;

  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */

  display: flex;
  flex-direction: space-between;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${shade(0.2, '#860209')};
  }

  > svg {
    width: 20px;
    height: 20px;
    color: #fff;
    margin-right: auto;
    animation: ${rotate} 2s linear infinite;
  }

  span {
    margin-right: auto;
    font-size: 16px !important;
    color: #d5d5d5 !important;
    font-weight: 500 !important;
  }
`;
