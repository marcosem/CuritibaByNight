import React, { useCallback, useRef, useEffect } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import { useHeader } from '../../hooks/header';

import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, AnimationContainer, Background } from './styles';

import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface ISignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const { setCurrentPage } = useHeader();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: ISignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-Mail obrigatório')
            .email('E-Mail inválido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn({
          email: data.email.toLowerCase(),
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Erro ao realizar o login, verifique as credenciais.',
        });
      }
    },
    [signIn, addToast, history],
  );

  useEffect(() => {
    setCurrentPage('signin', true);
  }, [setCurrentPage]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Logo />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Faça seu Login</h1>
            <Input name="email" icon={FiMail} mask="" placeholder="E-Mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              mask=""
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
