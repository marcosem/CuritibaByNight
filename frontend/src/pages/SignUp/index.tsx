import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Content, AnimationContainer, Background } from './styles';

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

interface InitialUserData {
  name: string;
  email?: string;
  phone?: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { id } = useParams();
  const [isBusy, setBusy] = useState(true);
  const [userData, setUserData] = useState<InitialUserData>(
    {} as InitialUserData,
  );
  const { addToast } = useToast();
  const history = useHistory();

  useEffect(() => {
    async function getUserData(): Promise<void> {
      setBusy(true);
      try {
        const response = await api.get(`users/complete/${id}`);
        const user = response.data;

        if (user) {
          setUserData({
            name: user.name,
            email: user.email,
            phone: user.phone,
          });
        }
      } catch (err) {
        history.push('/');

        addToast({
          type: 'error',
          title: 'Token Inválido',
          description: 'Token inválido ou vencido, solicite outo ao narrador.',
        });
      }
      setBusy(false);
    }

    getUserData();
  }, [id, addToast, history]);

  const handleSubmit = useCallback(
    async (data: FormData) => {
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

        await schema.validate(data, { abortEarly: false });

        if (data.password !== data.passwordConfirm) {
          formRef.current?.setErrors({
            passwordConfirm: 'Senha diferente da Confirmação',
          });
        }

        await api.post('/users/complete', {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          secret: id,
        });

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro efetuado!',
          description: 'Você já pode fazer seu logon no Curitiba By Night',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          if (!errors.passwordConfirm) {
            if (data.password !== data.passwordConfirm) {
              errors.passwordConfirm = 'Senha diferente da Confirmação';
            }
          }

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Erro ao realizar o cadastro, tente novamente.',
        });
      }
    },
    [history, addToast, id],
  );

  return (
    <Container>
      <Background />

      <Content>
        {!isBusy && userData.name && (
          <AnimationContainer>
            <Logo />

            <Form onSubmit={handleSubmit} ref={formRef} initialData={userData}>
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
            <Link to="/">
              <FiArrowLeft />
              Voltar para Logon
            </Link>
          </AnimationContainer>
        )}
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
