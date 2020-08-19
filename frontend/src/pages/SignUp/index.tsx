import React from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaIdCard, FaWhatsapp } from 'react-icons/fa';
import logoImg from '../../assets/logo.svg';
import { Container, Content, Background } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

const SignUp: React.FC = () => (
  <Container>
    <Background />
    <Content>
      <img src={logoImg} alt="Curitiba By Night" />

      <form>
        <h1>Faça seu Cadastro</h1>
        <Input name="login" icon={FiUser} placeholder="Login" />
        <Input name="name" icon={FaIdCard} placeholder="Nome do Jogador" />
        <Input name="email" icon={FiMail} placeholder="E-Mail do Jogador" />
        <Input name="phone" icon={FaWhatsapp} placeholder="Celular" />

        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="Senha"
        />
        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="Confirme a Senha"
        />

        <Button type="submit">Entrar</Button>
      </form>
      <a href="login">
        <FiArrowLeft />
        Voltar para Logon
      </a>
    </Content>
  </Container>
);

export default SignUp;
