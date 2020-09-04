import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import resetPasswordBackgroundImg from '../../assets/reset_password.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(1);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 30px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
    }
  }

  button {
    margin-top: 24px;
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${resetPasswordBackgroundImg}) no-repeat center;
  background-size: cover;
`;
