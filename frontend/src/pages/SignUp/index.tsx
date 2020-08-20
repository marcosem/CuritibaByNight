import React, { useCallback, useRef } from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, Background } from './styles';

import Logo from '../../components/Logo';
import Input from '../../components/Input';
import Button from '../../components/Button';

interface FormData {
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
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-Mail obrigatório')
          .email('E-Mail inválido'),
        phone: Yup.string().matches(
          phoneRegExp,
          'Entre com o formato: xx-xxxxx-xxxx',
        ),
        password: Yup.string().min(6, 'Mínimo 6 caracteres'),
        passwordConfirm: Yup.string().required('Confimação obrigatória'),
      });

      console.log(data);

      await schema.validate(data, { abortEarly: false });

      if (data.password !== data.passwordConfirm) {
        formRef.current?.setErrors({
          passwordConfirm: 'Senha diferente da Confirmação',
        });
      }
    } catch (err) {
      const errors = getValidationErrors(err);

      if (!errors.passwordConfirm) {
        if (data.password !== data.passwordConfirm) {
          errors.passwordConfirm = 'Senha diferente da Confirmação';
        }
      }

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
          <Input
            name="name"
            icon={FiUser}
            mask=""
            placeholder="Nome do Jogador"
          />
          <Input
            name="email"
            icon={FiMail}
            mask=""
            placeholder="E-Mail do Jogador"
          />
          <Input
            name="phone"
            icon={FaWhatsapp}
            mask="99-9999tt999?"
            formatChars={{ '9': '[0-9]', t: '[0-9-]', '?': '[0-9 ]' }}
            maskChar={null}
            placeholder="Celular"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            mask=""
            placeholder="Senha"
          />
          <Input
            name="passwordConfirm"
            icon={FiLock}
            type="password"
            mask=""
            placeholder="Confirme a Senha"
          />

          <Button type="submit">Cadastrar</Button>
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

/*
handlerChangeBrazilianPhone = (ev) => {
  const brazilianPhone = ev.target.value.replace(/[^0-9]+/g, '')
  this.setState({ brazilianPhone })
}
...
mask={this.state.brazilianPhone.length <= 10 ? '(99) 9999-9999?' : '(99) 99999-9999'}
formatChars={{ 9: '[0-9]', '?': '[0-9 ]' }}
onChange={this.handlerChangeBrazilianPhone}
value={this.state.brazilianPhone}
*/
