import React, { useCallback } from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaIdCard, FaWhatsapp } from 'react-icons/fa';
import { Form } from '@unform/web';
import * as Yup from 'yup';

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
  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      const phoneRegExp = /^$|(\d{2}-\d{4,5}-\d{4})$/;

      const schema = Yup.object().shape({
        login: Yup.string()
          .required('Login é obrigatório')
          .matches(/^[A-z]+$/, 'Login Precisa conter somente letras'),
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string()
          .required('E-Mail obrigatório')
          .email('Digite um e-mail válido'),
        phone: Yup.string()
          .matches(
            phoneRegExp,
            'Celular precisa estar no formato: DDD-#####-####',
          )
          .optional(),
        password: Yup.string().min(
          6,
          'Senha precisa conter no mínimo 6 catacteres',
        ),
        passwordConfirm: Yup.string().required(
          'Confimação de senha é obrigatória',
        ),
      });

      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      console.log(err);
    }
  }, []);

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
