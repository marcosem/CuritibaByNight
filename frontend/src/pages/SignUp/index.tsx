import React from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaIdCard, FaWhatsapp } from 'react-icons/fa';
import { Form } from '@unform/web';

import { Container, Content, Background } from './styles';

import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface FormData {
  login: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

const SignUp: React.FC = () => {
  function handleSubmit(data: FormData): void {
    console.log(data);
  }

  return (
    <Container>
      <Background />
      <Content>
        <Logo />

        <Form onSubmit={handleSubmit}>
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
            name="passwordConfirm"
            icon={FiLock}
            type="password"
            placeholder="Confirme a Senha"
          />

          <Button type="submit">Entrar</Button>
        </Form>
        <a href="login">
          <FiArrowLeft />
          Voltar para Logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
