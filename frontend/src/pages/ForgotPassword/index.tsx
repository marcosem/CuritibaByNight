import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FiMail, FiLogIn } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import { useHeader } from '../../hooks/header';

import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Content, AnimationContainer, Background } from './styles';

import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

interface IResetPasswordFormData {
  email: string;
}

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const { setCurrentPage } = useHeader();

  const handleSubmit = useCallback(
    async (data: IResetPasswordFormData) => {
      if (loading === true) {
        return;
      }

      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-Mail obrigatório')
            .email('E-Mail inválido'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/password/forgot', {
          email: data.email.toLowerCase(),
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail de confirmação, verifique sua caixa de entrada para recuperar sua senha.',
        });

        // password recovery
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description: 'Erro ao tentar realizar a recuperação de senha.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, loading],
  );

  useEffect(() => {
    setCurrentPage('forgotpassword', true);
  }, [setCurrentPage]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <Logo />

          <Form onSubmit={handleSubmit} ref={formRef}>
            <h1>Recuperar Senha</h1>
            <Input name="email" icon={FiMail} mask="" placeholder="E-Mail" />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Voltar para Login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
