import React, { useCallback, useRef } from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaIdCard, FaWhatsapp } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

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
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current?.setErrors({});
      const phoneRegExp = /^$|(\d{2}-\d{4,5}-?\d{4})$/;

      const schema = Yup.object().shape({
        login: Yup.string()
          .required('Login obrigatório')
          .matches(/^[A-z]+$/, 'Somente letras'),
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-Mail obrigatório')
          .email('E-Mail inválido'),
        phone: Yup.string().matches(phoneRegExp, 'Formato: ##-#####-####'),
        password: Yup.string().min(6, 'Mínimo 6 catacteres'),
        passwordConfirm: Yup.string().required('Confimação obrigatória'),
      });

      await schema.validate(data, { abortEarly: false });
    } catch (err) {
      const errors = getValidationErrors(err);

      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <Logo />

        <Form onSubmit={handleSubmit} ref={formRef}>
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
