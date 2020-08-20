import React, { useCallback, useRef, useContext } from 'react';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { AuthContext } from '../../context/AuthContext';

import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, Background } from './styles';

import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useContext(AuthContext);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});
        // const phoneRegExp = /^$|(\d{2}-\d{4,5}-?\d{4})$/;

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-Mail obrigatório')
            .email('E-Mail inválido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }
    },
    [signIn],
  );

  return (
    <Container>
      <Content>
        <Logo />

        <Form onSubmit={handleSubmit} ref={formRef}>
          <h1>Faça seu Logon</h1>
          <Input name="email" icon={FiMail} placeholder="E-Mail" />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Senha"
          />

          <Button type="submit">Entrar</Button>

          <a href="forgot">Esqueci minha senha</a>
        </Form>

        <a href="login">
          <FiLogIn />
          Criar conta
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
