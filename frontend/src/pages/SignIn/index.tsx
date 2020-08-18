import React from 'react';
import { FiUser, FiLock, FiLogIn } from 'react-icons/fi';
import logoImg from '../../assets/CbN_Logo.png';
import { Container, Content, Background } from './styles';

const SignIn: React.FC = () => (
  <Container>
    <Content>
      <img src={logoImg} alt="Curitiba By Night" />

      <form>
        <h1>Faça seu Logon</h1>
        <input placeholder="Login" />
        <input type="password" placeholder="Senha" />

        <button type="submit">Entrar</button>

        <a href="forgot">Esqueci minha senha</a>
      </form>

      <a href="login">
        <FiLogIn />
        Criar conta
      </a>
    </Content>
    <Background />
  </Container>
);

export default SignIn;
